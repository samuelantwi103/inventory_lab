import { Component } from 'react';
import Alert from './Alert';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <svg 
                className="w-16 h-16 text-red-500 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-slate-600 mb-6 text-[0.9375rem]">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>

            <Alert variant="error" className="mb-6">
              <p className="font-medium mb-1">Error Details:</p>
              <p className="text-sm">
                {this.state.error?.toString()}
              </p>
            </Alert>

            <div className="flex gap-3">
              <Button 
                variant="primary" 
                fullWidth
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
              <Button 
                variant="secondary" 
                fullWidth
                onClick={this.handleReset}
              >
                Try Again
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <summary className="cursor-pointer font-medium text-slate-700">
                  Stack Trace
                </summary>
                <pre className="mt-2 overflow-auto text-slate-600">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
