## Development Guidelines

- Use Tailwind's inline class names wherever possible, avoiding the styling code smell of adding styles to index.css
- Strongly prefer Tailwind class name presets over inline css object styling and styles in our index.css
- Avoid using React RefObjects and ref forwarding as much as possible, keeping component design straightforward and sensible, easy to come back to and read at a glance
- Always import explicitly and directly React library elements (e.g. React.ReactNode -> ReactNode), avoiding using the wildcard React-namespace pattern; treat React as native to the project as less like accessing some library/package
- Always use `type` as opposed to `interface` for TypeScript types