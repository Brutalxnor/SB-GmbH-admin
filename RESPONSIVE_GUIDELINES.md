# Mobile-First Development Guidelines

> [!IMPORTANT]
> **This project prioritizes Mobile View over Web View.** 
> All new features and UI changes MUST be designed and implemented with a mobile-first approach.

## Core Rules
1. **Always Use Breakpoints**: Use Tailwind's `sm:`, `md:`, `lg:` prefixes. Default styles (without prefixes) should target MOBILE screens.
2. **Responsive Layouts**:
   - Sidebar should be hidden/collapsible on mobile.
   - Use a dedicated Mobile Header/Navbar for navigation on small screens.
   - Use `px-4` or `px-6` for mobile containers instead of large paddings like `p-10`.
3. **Touch Targets**: Ensure buttons and links are large enough for thumb interaction (min 44x44px).
4. **Data Tables**: Implement horizontal scrolling or card-based views for tables on small screens.
5. **Modals**: Ensure modals are full-width or nearly full-width on mobile with proper scroll behavior.

## Verification
- Always test changes using the Browser subagent in a mobile viewport (e.g., 375x812).
