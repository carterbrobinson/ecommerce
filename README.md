# E-commerce Dashboard

A modern e-commerce dashboard built with Vue.js and Tailwind CSS.

## Features

- Sales analytics dashboard
- Order management
- Customer tracking
- Product inventory overview
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd final-project
```

2. Navigate to the Vue.js project directory:
```bash
cd ecommerce/ecommerce-vue
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
ecommerce-vue/
├── src/
│   ├── assets/      # Static assets
│   ├── components/  # Vue components
│   ├── views/       # Page components
│   ├── App.vue      # Root component
│   └── main.js      # Application entry point
├── public/          # Public static assets
└── package.json     # Project dependencies and scripts
```

## Development

- The project uses Vue.js 3 with the Composition API
- Styling is handled with Tailwind CSS
- Components are organized by feature in the `components` directory
- Page layouts are stored in the `views` directory

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 