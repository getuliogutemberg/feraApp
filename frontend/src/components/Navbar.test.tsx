import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, LinkProps } from 'react-router-dom';
import React from 'react';

// Import the component to be tested
import Navbar from './Navbar';
// import { AuthContext } from '../context/AuthContext'; // Import the actual context type if available - REMOVED as it was unused

// Mock react-router-dom hooks
const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();

// Define a type for the mocked Link props
type MockLinkProps = Omit<LinkProps, 'to'> & { to: string; };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
  Link: ({ children, to, ...rest }: MockLinkProps) => <a href={to} {...rest}>{children}</a>, // Removed any cast
}));

// Mock AuthContext
const mockedLogout = jest.fn() as jest.Mock;

// Define a basic type for the user object based on test usage
type MockUser = { name: string; customIcon: string | null; };

// Define a type that matches the mocked context value
type MockedAuthContextValue = {
  user: MockUser | null;
  logout: jest.Mock;
};

const MockAuthContext = React.createContext<MockedAuthContextValue>({
  user: null, // Default state is logged out
  logout: mockedLogout,
});

// Define a type for renderWithContextAndRouter options
type RenderOptions = {
  providerProps: MockedAuthContextValue;
};

// Helper component to wrap Navbar with mocked context and router
const renderWithContextAndRouter = (ui: React.ReactElement, { providerProps }: RenderOptions) => {
  return render(
    <Router>
      <MockAuthContext.Provider value={providerProps}>
        {ui}
      </MockAuthContext.Provider>
    </Router>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedUseNavigate.mockClear();
    mockedUseLocation.mockClear();
    mockedLogout.mockClear();
  });

  test('does not render on login, registro, or solicitar-registro paths', () => {
    mockedUseLocation.mockReturnValue({ pathname: '/login' });
    const { container } = renderWithContextAndRouter(<Navbar />, { providerProps: { user: null, logout: mockedLogout } });
    expect(container.firstChild).toBeNull();

    mockedUseLocation.mockReturnValue({ pathname: '/registro' });
    renderWithContextAndRouter(<Navbar />, { providerProps: { user: null, logout: mockedLogout } });
    expect(container.firstChild).toBeNull();

    mockedUseLocation.mockReturnValue({ pathname: '/solicitar-registro' });
    renderWithContextAndRouter(<Navbar />, { providerProps: { user: null, logout: mockedLogout } });
    expect(container.firstChild).toBeNull();
  });

  test('renders login button when user is logged out', () => {
    mockedUseLocation.mockReturnValue({ pathname: '/' });
    renderWithContextAndRouter(<Navbar />, { providerProps: { user: null, logout: mockedLogout } });
    
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByTitle('Sair')).toBeNull(); // Logout link should not be present
  });

  test('renders user name and logout link when user is logged in', () => {
    const mockUser = { name: 'Test User', customIcon: null };
    mockedUseLocation.mockReturnValue({ pathname: '/dashboard' });
    renderWithContextAndRouter(<Navbar />, { providerProps: { user: mockUser, logout: mockedLogout } });

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByTitle('Sair')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /login/i })).toBeNull(); // Login button should not be present
  });

  test('calls navigate to /login when login button is clicked', () => {
    mockedUseLocation.mockReturnValue({ pathname: '/' });
    renderWithContextAndRouter(<Navbar />, { providerProps: { user: null, logout: mockedLogout } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(mockedUseNavigate).toHaveBeenCalledWith('/login');
  });

  test('calls logout when logout link is clicked', () => {
    const mockUser = { name: 'Test User', customIcon: null };
    mockedUseLocation.mockReturnValue({ pathname: '/dashboard' });
    renderWithContextAndRouter(<Navbar />, { providerProps: { user: mockUser, logout: mockedLogout } });

    const logoutLink = screen.getByTitle('Sair');
    fireEvent.click(logoutLink);

    expect(mockedLogout).toHaveBeenCalledTimes(1);
  });

  // Add more tests here for other functionalities and edge cases
}); 