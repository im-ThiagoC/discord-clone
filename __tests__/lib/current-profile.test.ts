import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

// Mock dependencies
jest.mock('@clerk/nextjs', () => ({
	// explicit mock used in tests
	auth: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
	db: {
		profile: {
			findUnique: jest.fn(),
		},
	},
}))

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindUnique = db.profile.findUnique as jest.Mock

beforeEach(() => {
	jest.clearAllMocks()
})

describe('currentProfile', () => {
	it('returns null when not authenticated', async () => {
		mockAuth.mockReturnValue({ userId: null } as any)

		const out = await currentProfile()

		expect(out).toBeNull()
		expect(mockFindUnique).not.toHaveBeenCalled()
	})

	it('returns the profile when found for the userId', async () => {
		mockAuth.mockReturnValue({ userId: 'user_2fKu1EyFjVePepQjbj8xyQyGLcl' } as any)

		const profile = {
			id: '90af3e52-2769-4195-97e3-ec10028dd44a',
			name: 'Thiago Medeiros',
			userId: 'user_2fKu1EyFjVePepQjbj8xyQyGLcl',
		}
		mockFindUnique.mockResolvedValue(profile)

		const out = await currentProfile()

		expect(mockFindUnique).toHaveBeenCalledWith({
			where: { userId: 'user_2fKu1EyFjVePepQjbj8xyQyGLcl' },
		})
		expect(out).toEqual(profile)
	})

	it('returns null when not found for the userId', async () => {
		mockAuth.mockReturnValue({ userId: 'user-456' } as any)
		mockFindUnique.mockResolvedValue(null)

		const out = await currentProfile()

		expect(mockFindUnique).toHaveBeenCalledWith({
			where: { userId: 'user-456' },
		})
		expect(out).toBeNull()
	})
})
