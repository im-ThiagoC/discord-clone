/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, waitFor, render } from '@testing-library/react'
import { ChannelType } from '@prisma/client'

// Dependencies mocks

// Mock of next/navigation with spyable `redirect`
jest.mock('next/navigation', () => ({
	redirect: jest.fn(),
}))

// Mock of Clerk with `redirectToSignIn`
jest.mock('@clerk/nextjs', () => ({
	auth: jest.fn(),
	redirectToSignIn: jest.fn(),
}))

// Mock of DB with methods used by the page
jest.mock('@/lib/db', () => ({
	db: {
		profile: { findUnique: jest.fn() },
		channel: { findUnique: jest.fn() },
		member: { findFirst: jest.fn() },
	},
}))

// Mock of currentProfile (to avoid real Clerk)
jest.mock('@/lib/current-profile', () => ({
	currentProfile: jest.fn(),
}))

// Mock of Client Components that pull heavy ESM libs
jest.mock('@/components/chat/chat-input', () => ({
	__esModule: true,
	ChatInput: ({ name }: any) => <div data-testid="chat-input">ChatInput:{name}</div>,
}))
jest.mock('@/components/chat/chat-messages', () => ({
	__esModule: true,
	ChatMessages: ({ name }: any) => <div data-testid="chat-messages">ChatMessages:{name}</div>,
}))
jest.mock('@/components/media-room', () => ({
	__esModule: true,
	MediaRoom: () => <div data-testid="media-room">MediaRoom</div>,
}))

// Imports after mocks
import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

// Component under test
import ChannelIdPage from '@/app/(main)/(routes)/servers/[serverId]/channels/[channelId]/page'

// Global data to use
const PROFILE_ID 	= "90af3e52-2769-4195-97e3-ec10028dd44a"
const CHANNEL_ID 	= "0e21c0c2-6309-4ca9-b48d-b5194169206a"
const SERVER_ID 	= "2ca91049-4739-49e0-9dd4-135d4177bd6a"
const MEMBER_ID 	= "b7c4d17d-d4d0-45ab-aaa7-710f300a79ac"

const mockParams = {
	serverId: SERVER_ID,
	channelId: CHANNEL_ID,
}

describe('ChannelIdPage', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(currentProfile as jest.Mock).mockResolvedValue({ id: PROFILE_ID });
	});

	it('redirects to sign in if no profile', async () => {
		(currentProfile as jest.Mock).mockResolvedValue(null);

		await ChannelIdPage({ params: mockParams });

		expect(redirectToSignIn).toHaveBeenCalledTimes(1);
	})

	it('redirects to / if no channel or member', async () => {
		(currentProfile as jest.Mock).mockResolvedValue({ id: PROFILE_ID });

		await ChannelIdPage({ params: mockParams });

		expect(redirect).toHaveBeenCalledWith('/');
	})

	it('renders TEXT chat correctly (stubs)', async () => {
		(currentProfile as jest.Mock).mockResolvedValue({ id: PROFILE_ID });

		(db.channel.findUnique as jest.Mock).mockResolvedValue({
			id: CHANNEL_ID,
			name: 'geral',
			serverId: SERVER_ID,
			type: ChannelType.TEXT,
		});

		(db.member.findFirst as jest.Mock).mockResolvedValue({ id: MEMBER_ID });

		// The server page returns JSX (not string). We can render it.
		const tree = await ChannelIdPage({ params: mockParams });
		render(tree);

		await waitFor(() => {
			expect(screen.getByText('geral')).toBeInTheDocument()
			expect(screen.getByTestId('chat-messages')).toHaveTextContent('ChatMessages:geral')
			expect(screen.getByTestId('chat-input')).toHaveTextContent('ChatInput:geral')
		})
	})
})
