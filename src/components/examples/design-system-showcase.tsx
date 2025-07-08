'use client'

import React, { useState } from 'react'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  StatsCard,
  Input,
  Badge,
  Label,
  FormField,
  Select,
  MultiSelect,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui'

import IconButton from '@/components/ui/icon-button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { 
  Search, 
  Mail, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Plus,
  Settings,
  Heart,
  Share2,
  Bell,
  User,
  MapPin
} from 'lucide-react'

/**
 * Design System Showcase Component
 * Demonstrates all components with their variants and usage patterns
 */
export default function DesignSystemShowcase() {
  const [selectValue, setSelectValue] = useState('')
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([])
  const [formMultiSelectValue, setFormMultiSelectValue] = useState<string[]>(['red'])

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]

  const colorOptions = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' }
  ]

  return (
    <Container 
      maxWidth="4xl" 
      title="Design System Showcase" 
      subtitle="A comprehensive overview of all available components and their variants"
    >
      {/* Buttons Section */}
      <PageSection title="Buttons" subtitle="Various button styles and sizes">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle as="h4">Primary Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="sm">Small Button</Button>
              <Button size="default">Medium Button</Button>
              <Button size="lg">Large Button</Button>
              <Button size="xl">Extra Large</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Button Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Special States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button loading>Loading</Button>
              <Button leftIcon={<Mail className="h-4 w-4" />}>With Icon</Button>
              <Button rightIcon={<TrendingUp className="h-4 w-4" />}>Trending</Button>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Icon Buttons Section */}
      <PageSection title="Icon Buttons" subtitle="Icon-only buttons for actions">
        <Card>
          <CardHeader>
            <CardTitle as="h4">Icon Button Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <IconButton icon={<Plus className="h-4 w-4" />} aria-label="Add item" />
              <IconButton icon={<Settings className="h-4 w-4" />} aria-label="Settings" variant="secondary" />
              <IconButton icon={<Heart className="h-4 w-4" />} aria-label="Like" variant="outline" />
              <IconButton icon={<Share2 className="h-4 w-4" />} aria-label="Share" variant="ghost" />
              <IconButton icon={<Bell className="h-4 w-4" />} aria-label="Notifications" variant="destructive" />
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Cards Section */}
      <PageSection title="Cards" subtitle="Different card styles and layouts">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                This is a standard card with default styling and shadow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Card content goes here with proper spacing and typography.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>
                This card has enhanced shadow for emphasis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Perfect for highlighting important content.
              </p>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
              <CardDescription>
                This card uses border emphasis instead of shadow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Great for subtle content separation.
              </p>
            </CardContent>
          </Card>

          <Card interactive>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>
                This card responds to hover and focus states.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click or focus to see the interaction effects.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Stats Cards Section */}
      <PageSection title="Stats Cards" subtitle="Specialized cards for displaying metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value="12,345"
            change={{ value: "+12%", type: "increase" }}
            icon={<Users className="h-6 w-6" />}
          />
          <StatsCard
            title="Revenue"
            value="$45,678"
            change={{ value: "+8%", type: "increase" }}
            icon={<DollarSign className="h-6 w-6" />}
          />
          <StatsCard
            title="Events"
            value="1,234"
            change={{ value: "-3%", type: "decrease" }}
            icon={<Calendar className="h-6 w-6" />}
          />
          <StatsCard
            title="Growth"
            value="23%"
            change={{ value: "0%", type: "neutral" }}
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>
      </PageSection>

      {/* Alerts Section */}
      <PageSection title="Alerts" subtitle="Contextual feedback messages">
        <div className="space-y-4">
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is a default alert. Use it for general information that doesn&apos;t require immediate attention.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              This is a destructive alert. Use it for error messages and critical warnings.
            </AlertDescription>
          </Alert>

          {/* Custom styled alerts */}
          <Alert className="border-green-200 text-green-800 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              This is a success alert. Use it for confirmation messages.
            </AlertDescription>
          </Alert>

          <Alert className="border-yellow-200 text-yellow-800 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This is a warning alert. Use it for important notices that need attention.
            </AlertDescription>
          </Alert>
        </div>
      </PageSection>

      {/* Avatars Section */}
      <PageSection title="Avatars" subtitle="User profile pictures and fallbacks">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle as="h4">Avatar Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Small avatar" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Medium avatar" />
                  <AvatarFallback>MD</AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Large avatar" />
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Extra large avatar" />
                  <AvatarFallback>XL</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Fallback Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Inputs Section */}
      <PageSection title="Inputs" subtitle="Form inputs with various states and styles">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle as="h4">Input Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Default input" />
              <Input variant="filled" placeholder="Filled input" />
              <Input variant="ghost" placeholder="Ghost input" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Input Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input size="sm" placeholder="Small input" />
              <Input size="md" placeholder="Medium input" />
              <Input size="lg" placeholder="Large input" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Input States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Normal state" />
              <Input state="success" placeholder="Success state" />
              <Input state="warning" placeholder="Warning state" />
              <Input error="This field is required" placeholder="Error state" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Input with Icons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                leftIcon={<Search className="h-4 w-4" />}
                placeholder="Search..." 
              />
              <Input 
                leftIcon={<Mail className="h-4 w-4" />}
                placeholder="Email address"
                type="email"
              />
              <Input 
                placeholder="With helper text"
                helperText="This is helpful information"
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Form Fields Section */}
      <PageSection title="Form Fields" subtitle="Structured form inputs with labels and validation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle as="h4">Basic Form Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Full Name"
                placeholder="Enter your full name"
                required
              />
              <FormField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                required
              />
              <FormField
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                helperText="Include country code"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Form Fields with States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Username"
                placeholder="Enter username"
                error="Username is already taken"
              />
              <FormField
                label="Website"
                placeholder="https://example.com"
                leftIcon={<MapPin className="h-4 w-4" />}
              />
              <FormField
                label="Optional Field"
                placeholder="This field is optional"
                helperText="You can leave this blank"
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Labels Section */}
      <PageSection title="Labels" subtitle="Standalone labels with various styles">
        <Card>
          <CardHeader>
            <CardTitle as="h4">Label Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label variant="default">Default Label</Label>
              <Label variant="muted">Muted Label</Label>
              <Label variant="error">Error Label</Label>
              <Label variant="success">Success Label</Label>
            </div>
            <div className="space-y-2">
              <Label size="sm">Small Label</Label>
              <Label size="md">Medium Label</Label>
              <Label size="lg">Large Label</Label>
            </div>
            <div>
              <Label required>Required Field Label</Label>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Select Components Section */}
      <PageSection title="Select Components" subtitle="Dropdown selection components">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle as="h4">Basic Select</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Choose an option"
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="Select an option..."
              />
              <Select
                label="Required Select"
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="Must select one..."
                required
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h4">Multi Select</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultiSelect
                label="Multiple Options"
                options={colorOptions}
                value={multiSelectValue}
                onChange={setMultiSelectValue}
                placeholder="Select colors..."
                displayMode="badges"
              />
              <MultiSelect
                label="Compact Mode"
                options={colorOptions}
                value={multiSelectValue}
                onChange={setMultiSelectValue}
                placeholder="Select colors..."
                displayMode="compact"
                maxSelections={3}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle as="h4">Form Multi Select</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiSelect
                id="colors"
                name="selectedColors"
                label="Favorite Colors"
                options={colorOptions}
                value={formMultiSelectValue}
                onChange={setFormMultiSelectValue}
                placeholder="Choose your favorite colors..."
                maxSelections={3}
                required
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Dialog Section */}
      <PageSection title="Dialogs" subtitle="Modal dialogs for user interactions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Legacy Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Legacy Dialog</DialogTitle>
                <DialogDescription>
                  This is the old dialog style for comparison.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Old dialog content style.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <UnifiedDialogBasicDemo />
          <UnifiedDialogScrollableDemo />
        </div>
      </PageSection>

      {/* Popover Section */}
      <PageSection title="Popovers" subtitle="Contextual overlays and dropdowns">
        <Card>
          <CardHeader>
            <CardTitle as="h4">Popover Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Basic Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Popover Title</h4>
                    <p className="text-sm text-muted-foreground">
                      This is a popover with some content. You can put any component here.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Form Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Quick Settings</h4>
                    <FormField
                      label="Name"
                      placeholder="Enter name"
                    />
                    <div className="flex justify-end">
                      <Button size="sm">Save</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Badges Section */}
      <PageSection title="Badges" subtitle="Small status and category indicators">
        <Card>
          <CardHeader>
            <CardTitle as="h4">Badge Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Typography Section */}
      <PageSection title="Typography" subtitle="Consistent text styling throughout the application">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <h1 className="text-4xl font-semibold text-foreground mb-2 tracking-tight">
                Heading 1 - Main Title
              </h1>
              <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
                Heading 2 - Section Title
              </h2>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Heading 3 - Subsection
              </h3>
              <p className="text-base text-foreground leading-relaxed mb-2">
                Body text - This is the standard paragraph text used throughout the application. 
                It maintains good readability with proper line height and spacing.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Small text - Used for captions, helper text, and secondary information.
              </p>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </Container>
  )
}

// Demo components for UnifiedDialog
function UnifiedDialogBasicDemo() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Unified Dialog
      </Button>
      <UnifiedDialog
        open={open}
        onOpenChange={setOpen}
        title="Enhanced Dialog"
        description="This is the new unified dialog with glassmorphism styling, enhanced animations, and consistent layout."
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This dialog features:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
            <li>Glassmorphism styling with backdrop blur</li>
            <li>Always-visible header and footer</li>
            <li>Scrollable content area</li>
            <li>Enhanced animations</li>
            <li>Consistent design system integration</li>
          </ul>
        </div>
      </UnifiedDialog>
    </>
  )
}

function UnifiedDialogScrollableDemo() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Scrollable Content
      </Button>
      <UnifiedDialog
        open={open}
        onOpenChange={setOpen}
        title="Scrollable Dialog"
        description="This dialog demonstrates scrollable content handling with fixed header and footer."
        size="lg"
        footer={
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          {Array.from({ length: 20 }, (_, i) => (
            <Card key={i} variant="embedded">
              <CardHeader>
                <CardTitle>Content Item {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is content item {i + 1}. The dialog content is scrollable while the header 
                  and footer remain fixed in place. This ensures that important actions and 
                  information are always accessible.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </UnifiedDialog>
    </>
  )
} 