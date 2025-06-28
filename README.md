# Shopify Product Importer

A modern web application built to simplify the process of importing products into Shopify stores. Upload product files, validate data, and seamlessly integrate with your Shopify store through an intuitive interface.

## 🚀 Features

- **File Upload Interface**: Drag-and-drop file upload with support for multiple file formats
- **File Validation**: Built-in validation for file size, type, and quantity limits
- **Modern UI**: Clean, responsive interface built with TailwindCSS and shadcn/ui
- **Type Safety**: Full TypeScript support for enhanced development experience
- **Monorepo Architecture**: Organized codebase with shared components and configurations
- **Fast Development**: Powered by Turbo for lightning-fast builds and hot reloading

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **API**: [Hono](https://hono.dev/) for edge-optimized API routes
- **Build System**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
shopify-importer/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/
│       │   ├── api/            # API routes using Hono
│       │   ├── layout.tsx      # Root layout
│       │   └── page.tsx        # Home page
│       ├── components/         # React components
│       │   ├── file-upload.tsx # File upload component
│       │   └── providers.tsx   # App providers
│       └── hooks/              # Custom React hooks
│           └── use-file-upload.ts
├── packages/
│   ├── ui/                     # Shared UI components
│   │   └── src/components/
│   └── config/                 # Shared configurations
└── package.json                # Root package.json
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: >= 20.0.0
- **pnpm**: >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopify-importer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `pnpm dev` - Start development server with Turbo
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Run linting with Biome
- `pnpm lint:fix` - Fix linting issues automatically

## 📝 Usage

### File Upload

1. **Access the Upload Interface**: Navigate to the main page
2. **Upload Files**: 
   - Drag and drop files onto the upload area, or
   - Click to browse and select files
3. **File Validation**: The system automatically validates:
   - File types (supports documents, spreadsheets, archives, images, etc.)
   - File size (max 100MB per file)
   - Number of files (max 10 files)
4. **Manage Files**: Review uploaded files and remove any if needed

### Supported File Types

- **Documents**: PDF, DOC, DOCX
- **Spreadsheets**: XLS, XLSX (ideal for product data)
- **Archives**: ZIP, RAR
- **Images**: JPG, PNG, GIF, etc.
- **Media**: Video and audio files

## 🔧 Development

### Adding New Features

1. **Components**: Add new components to `apps/web/components/`
2. **API Routes**: Extend the Hono app in `apps/web/app/api/`
3. **Shared UI**: Add reusable components to `packages/ui/src/components/`
4. **Hooks**: Create custom hooks in `apps/web/hooks/`

### Code Quality

The project uses:
- **Biome** for linting and formatting
- **TypeScript** for type checking
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

### Build Optimization

- **Turborepo** provides incremental builds and caching
- **Next.js 15** with Turbopack for fast development
- **Edge runtime** for API routes

## 🌟 Roadmap

- [ ] Shopify API integration
- [ ] Product data mapping interface
- [ ] Bulk import processing
- [ ] Import progress tracking
- [ ] Error handling and reporting
- [ ] Product preview before import
- [ ] Import history and logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify API Documentation](https://shopify.dev/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
