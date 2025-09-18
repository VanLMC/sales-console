# Sales Console

A modern, accessible sales lead management application built with React and TypeScript. This application streamlines the process of managing sales leads, tracking their progress, and converting qualified prospects into opportunities.

## 🎯 Purpose

Sales Console solves the common problem of scattered lead management by providing a centralized, user-friendly interface for sales teams to:
- Track and organize sales leads efficiently
- Filter and search through large datasets with real-time feedback
- Edit lead information with comprehensive validation
- Convert qualified leads into opportunities
- Maintain data persistence across sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sales-console
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start development server**
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   yarn build
   ```

## 📖 Usage

### Managing Leads
- **View Leads**: Browse all leads in an organized table format
- **Search**: Use the search bar to find leads by name or company
- **Filter**: Filter leads by status (New, Contacted, Qualified, Unqualified)
- **Sort**: Click the score column header to sort leads by score
- **Edit**: Click any lead row to open the detail panel for editing

### Lead Details
- **Edit Information**: Modify email, status, and deal amount
- **Validation**: Real-time form validation with helpful error messages
- **Convert**: Transform qualified leads into opportunities
- **Persistence**: Changes are automatically saved

### Opportunities
- **Track Progress**: View converted leads as opportunities
- **Monitor Pipeline**: See opportunity stages and amounts
- **Account Management**: Organize by account names

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (buttons, inputs, etc.)
│   ├── __tests__/       # Component tests
│   ├── LeadsList.tsx    # Main leads table with filtering
│   ├── LeadDetailPanel.tsx # Lead editing modal
│   └── OpportunitiesList.tsx # Opportunities display
├── hooks/               # Custom React hooks
│   ├── __tests__/       # Hook tests
│   ├── useLeads.ts      # Lead data management
│   ├── useLeadsFilters.ts # Filter state management
│   ├── useLocalStorage.ts # Persistent storage
│   └── useDebounce.ts   # Performance optimization
├── utils/               # Utility functions
│   ├── __tests__/       # Utility tests
│   ├── formatting.ts    # Currency and data formatting
│   ├── validation.ts    # Form validation logic
│   └── status.ts        # Lead status management
├── types/               # TypeScript type definitions
└── data/               # Mock data and fixtures
```

## ✨ Features

### Core Functionality
- **Lead Management**: Complete CRUD operations for sales leads
- **Opportunity Tracking**: Convert and monitor sales opportunities
- **Real-time Search**: Instant filtering with debounced input
- **Data Persistence**: Filters and preferences saved locally
- **Responsive Design**: Works seamlessly on desktop and mobile

### Advanced Features
- **Infinite Scroll**: Efficient loading of large datasets
- **Form Validation**: Comprehensive client-side validation
- **Theme Support**: Light/dark mode toggle
- **Accessibility**: Full WCAG compliance with screen reader support
- **Type Safety**: Complete TypeScript coverage

### Performance Optimizations
- **Debounced Search**: Reduces API calls and improves responsiveness
- **Memoized Calculations**: Optimized filtering and sorting
- **Lazy Loading**: Components load only when needed
- **Efficient Re-renders**: Minimized unnecessary updates

## 🛠 Tech Stack

### Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Vite** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Class Variance Authority** - Type-safe component variants

### State Management & Data
- **Custom Hooks** - Lightweight state management
- **Local Storage** - Client-side data persistence
- **JSON Data** - Mock data for development

### Development & Testing
- **Vitest** - Fast, modern testing framework
- **React Testing Library** - Component testing utilities
- **ESLint & TypeScript** - Code quality and type checking

## 🧪 Testing

The project includes comprehensive test coverage across all layers:

### Run Tests
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with UI
yarn test:ui

# Run tests once (CI mode)
yarn test:run

# Generate coverage report
yarn test:coverage
```

### Test Coverage
- **Components**: UI component behavior and interactions
- **Hooks**: Custom hook logic and state management
- **Utils**: Utility functions and business logic
- **Integration**: End-to-end user workflows

### Test Categories
- **Unit Tests**: Individual function and component testing
- **Integration Tests**: Component interaction testing
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Performance Tests**: Debouncing and optimization verification

## 🎨 Code Quality Features

### Architecture Excellence
- **Separation of Concerns**: Clear boundaries between UI, logic, and data
- **Custom Hooks**: Reusable business logic extracted from components
- **Utility Functions**: Pure functions for formatting, validation, and calculations
- **Type Safety**: Comprehensive TypeScript coverage with strict mode

### User Experience Enhancements
- **Debounced Search**: 500ms delay prevents excessive filtering during typing
- **Persistent Filters**: User preferences saved in localStorage
- **Loading States**: Clear feedback during data operations
- **Error Handling**: Graceful error states with helpful messages

### Accessibility Excellence
- **WCAG Compliance**: Full accessibility support for screen readers
- **Keyboard Navigation**: Complete keyboard-only operation
- **ARIA Labels**: Comprehensive labeling for assistive technologies
- **Focus Management**: Proper focus handling in modals and forms

### Performance Optimizations
- **Memoization**: Expensive calculations cached with useMemo
- **Debouncing**: Search input optimized to reduce computational overhead
- **Lazy Loading**: Components and data loaded on demand
- **Efficient Updates**: Minimal re-renders through proper dependency arrays

## 🚀 Development Workflow

### Code Organization
- **Modular Components**: Single responsibility principle
- **Custom Hooks**: Business logic separated from presentation
- **Utility Functions**: Pure, testable helper functions
- **Type Definitions**: Centralized TypeScript interfaces

### Quality Assurance
- **Comprehensive Testing**: 85+ tests covering all functionality
- **Type Checking**: Strict TypeScript configuration
- **Code Formatting**: Consistent code style enforcement
- **Performance Monitoring**: Optimized bundle size and runtime performance

---

Built with ❤️ using modern React patterns and best practices.