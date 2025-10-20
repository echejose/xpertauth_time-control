# Design Guidelines: Worker Time Tracking Application

## Design Approach
**Selected Approach**: Design System with productivity app inspiration (Linear, Notion, Toggl, Clockify)

**Justification**: This is a utility-focused application where efficiency, clarity, and daily usability are paramount. Workers need quick, reliable access to time tracking functions without visual distractions.

**Key Design Principles**:
- Clarity over decoration: Every element serves a functional purpose
- Immediate feedback: Clear visual states for active work, breaks, and completed shifts
- Scannable data: Easy-to-read time logs and statistics
- Accessible actions: Large, clear buttons for time entry operations

## Color Palette

**Dark Mode** (Primary):
- Background: 220 15% 10%
- Surface: 220 15% 15%
- Surface Elevated: 220 15% 20%
- Primary (Active Work): 142 70% 45% (green for working status)
- Warning (Break): 38 92% 50% (amber for pause states)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%
- Border: 220 15% 25%

**Light Mode**:
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary (Active Work): 142 60% 40%
- Warning (Break): 38 85% 45%
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 45%
- Border: 220 10% 85%

## Typography
- **Font Family**: 'Inter' or 'Roboto' from Google Fonts
- **Headings**: font-semibold, text-2xl to text-4xl
- **Body Text**: font-normal, text-base
- **Time Displays**: font-mono, text-xl to text-3xl (for clarity and precision)
- **Labels**: font-medium, text-sm
- **Data Tables**: font-normal, text-sm

## Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Button padding: px-6 py-3
- Card padding: p-6
- Section spacing: space-y-6, space-y-8
- Container max-width: max-w-6xl

## Component Library

### Core UI Elements

**Status Card** (Current Shift Display):
- Large, prominent card showing current status: "Trabajando", "En Pausa - Desayuno", "Jornada Finalizada"
- Real-time running clock display in monospace font (HH:MM:SS)
- Visual indicator: Green border for working, amber for break, gray for finished
- Positioned at top of interface for immediate visibility

**Time Entry Buttons**:
- Large, full-width buttons for mobile optimization
- Grid layout: 2 columns on mobile, 3-4 columns on desktop
- Each button clearly labeled: "Entrada", "Inicio Desayuno", "Fin Desayuno", "Inicio Merienda", "Fin Merienda", "Finalizar Jornada"
- Disabled state for buttons that aren't contextually available
- Icon + text combination for clarity

**Statistics Dashboard**:
- Three-column grid displaying:
  - Total Horas Trabajadas (primary metric, larger)
  - Tiempo en Pausas (secondary)
  - Tiempo Real de Trabajo (calculated, highlighted)
- Each metric in its own card with icon, label, and large numeric display

### Data Displays

**Time Log Table**:
- Clean table design with alternating row colors for readability
- Columns: Fecha, Entrada, Salida, Pausas, Horas Totales, Tiempo Real
- Sticky header for scrolling
- Responsive: Stack to cards on mobile
- Sorting capabilities by date/time

**View Toggles**:
- Tab navigation for Semanal, Mensual, Anual views
- Clear active state indication
- Positioned above time log table

**Calendar Integration**:
- Month view calendar highlighting worked days
- Color coding for full days vs. partial days
- Click-to-view-details interaction

### Navigation
- Simple top navigation bar with app title
- User info/profile in top-right corner
- Export/download data button (secondary action)

### Forms & Overlays
- Modal for manual time entry corrections (if needed)
- Confirmation dialog for "Finalizar Jornada"
- Toast notifications for successful time entries

## Animations
**Minimal, Purposeful Only**:
- Smooth transitions on button states (200ms)
- Fade-in for toast notifications
- No scroll animations or decorative effects

## Layout Structure

**Main View** (Single Page Application):
1. **Header**: App title, date, user info (h-16)
2. **Status Section**: Current shift status card (prominent, mb-8)
3. **Actions Grid**: Time entry buttons (mb-12)
4. **Statistics Dashboard**: Three key metrics (mb-12)
5. **Historical Data**: View toggle tabs + data table
6. **Footer**: Minimal, data retention info

**Grid Breakpoints**:
- Mobile: Single column, stacked
- Tablet (md:): 2 columns for buttons/stats
- Desktop (lg:): 3-4 columns for optimal density

## Key Interaction Patterns
- Button press → Immediate timestamp capture → Visual confirmation → Update status card
- Disabled states prevent incorrect sequences (can't end break before starting it)
- Real-time clock updates every second when shift is active
- Auto-save all entries to localStorage/database

## Accessibility Considerations
- High contrast ratios for all text (WCAG AA minimum)
- Consistent dark mode across all inputs and surfaces
- Keyboard navigation support for all actions
- Clear focus indicators on interactive elements
- Screen reader labels for all time displays and buttons