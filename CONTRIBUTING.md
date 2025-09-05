# Contributing to Attendance Scanner

> **Note**: This project is archived and no longer actively maintained as of April 2024. This guide is provided for reference only.

Thank you for your interest in the Attendance Scanner project! While this project is no longer under active development, this guide documents how contributions were structured during its development phase.

## Project Status

- ✅ **Completed**: Core functionality and MVP features
- ❌ **Archived**: No longer accepting new contributions
- 📚 **Reference**: Available for learning and inspiration

## Original Development Guidelines

### Code Style

#### Frontend (SvelteKit)

- TypeScript for all new code
- Prettier for code formatting
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

#### Backend (Python)

- PEP 8 style guidelines
- Type hints where applicable
- Docstrings for functions
- Error handling for all network operations

### Commit Convention

We followed conventional commits:

```text
feat: add new attendance tracking feature
fix: resolve scanner connection timeout
docs: update deployment guide
refactor: improve error handling in API
```

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature development
- `hotfix/*`: Critical bug fixes

## Educational Use

This project can serve as a learning resource for:

### Full-Stack Development

- SvelteKit application architecture
- TypeScript in modern web development
- Database design with Drizzle ORM
- Authentication with Lucia

### Hardware Integration

- Raspberry Pi programming
- SPI display communication
- USB device integration
- Linux service management

### DevOps Practices

- Docker containerization
- Environment variable management
- Database migrations
- Deployment automation

## Known Technical Debt

Areas that would benefit from improvement:

### Security

- [ ] Rate limiting implementation
- [ ] Input sanitization improvements
- [ ] API endpoint authentication hardening
- [ ] Database connection encryption

### Code Quality

- [ ] Unit test coverage
- [ ] Integration test suite
- [ ] Error boundary implementations
- [ ] Performance optimizations

### Documentation

- [ ] API documentation
- [ ] Component documentation
- [ ] Hardware setup videos
- [ ] Troubleshooting guides

## Learning Opportunities

### Beginner Projects

- Implement basic analytics dashboard
- Add export functionality for attendance data

### Intermediate Projects

- Implement offline mode for scanner
- Add real-time notifications
- Create automated backup system
- Build admin analytics dashboard

### Advanced Projects

- Implement microservices architecture
- Add machine learning for fraud detection
- Create mobile app with React Native
- Implement advanced security features

## Resources

### Technologies Used

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Lucia Auth](https://lucia-auth.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)

## Contact

For questions about the codebase or architecture decisions:

- **Author**: Adam San Clemente
- **GitHub**: [@adamsanclemente](https://github.com/adamsanclemente)
- **LinkedIn**: [/in/adam-san-clemente](https://linkedin.com/in/adam-san-clemente)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
