# UI Components

This directory contains reusable UI components that follow our design system. All components use consistent styling and can be customized through props.

## Design System Rules

- **Corner Radius**: Use `rounded-lg` (8px) for all interactive elements and containers
- **Exceptions**: Keep `rounded-full` only for circular elements (selection indicators, small dots, progress bars)
- **Colors**: Use neutral color palette for consistency
- **Spacing**: Use Tailwind's spacing scale (4px increments)

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui';

// Variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Delete Button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With icons
<Button variant="primary" size="md">
  <Plus className="w-4 h-4" />
  Add Item
</Button>
```

### Card

A flexible card component with sub-components for better composition.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

// Basic usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Variants
<Card variant="default">Default card</Card>
<Card variant="elevated">Elevated card with shadow</Card>
<Card variant="outlined">Outlined card</Card>
```

### Badge

A badge component for tags and status indicators.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Toggle

A toggle component for switches and checkboxes.

```tsx
import { Toggle } from '@/components/ui';

// Basic toggle
<Toggle checked={isEnabled} onChange={setIsEnabled} />

// With label and description
<Toggle 
  checked={isEnabled} 
  onChange={setIsEnabled}
  label="Enable notifications"
  description="Receive updates about your account"
/>

// Different sizes
<Toggle size="sm" />
<Toggle size="md" />
<Toggle size="lg" />
```

### Progress

A progress bar component with different variants.

```tsx
import { Progress } from '@/components/ui';

// Basic usage
<Progress value={75} max={100} />

// Different sizes
<Progress value={50} size="sm" />
<Progress value={75} size="md" />
<Progress value={90} size="lg" />

// Variants
<Progress value={75} variant="default" />
<Progress value={75} variant="success" />
<Progress value={75} variant="warning" />
<Progress value={75} variant="error" />
```

## Usage Guidelines

1. **Always use these components** instead of custom button/card styling
2. **Customize through props** rather than overriding classes
3. **Use consistent variants** across similar UI elements
4. **Follow the design system** for spacing, colors, and typography

## Benefits

- **Consistency**: All buttons, cards, etc. look the same
- **Maintainability**: Change styling in one place
- **Accessibility**: Built-in focus states and ARIA attributes
- **Performance**: Optimized and reusable components
- **Developer Experience**: Clear API and TypeScript support
