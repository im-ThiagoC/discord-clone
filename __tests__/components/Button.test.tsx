import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'
import { renderWithProviders } from '@/tests/test-utils'

describe('<Button />', () => {
	it('render and click', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();
		renderWithProviders(<Button onClick={onClick}>Send</Button>);
		await user.click(screen.getByRole('button', { name: /send/i }));
		expect(onClick).toHaveBeenCalledTimes(1);
	})
})