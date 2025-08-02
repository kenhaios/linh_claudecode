# Claude Code Instructions for Ha Linh Project

## Overview
This document provides instructions for Claude Code to build the Ha Linh Vietnamese Astrology AI Website using a phased approach with structured prompts and automated workflow.

## Project Structure
```
ha-linh-tuvi/
├── prompts/
│   ├── prompt_1_research_analysis.md
│   ├── prompt_2_foundation_setup.md
│   ├── prompt_3_authentication_system.md
│   ├── prompt_4_chart_generation.md
│   ├── prompt_5_chat_integration.md
│   ├── prompt_6_ai_service.md
│   ├── prompt_7_token_management.md
│   ├── prompt_8_payment_system.md
│   ├── prompt_9_frontend_ui.md
│   └── prompt_10_testing_deployment.md
├── summaries/
│   ├── summary_1_research_analysis.md
│   ├── summary_2_foundation_setup.md
│   ├── summary_3_authentication_system.md
│   ├── summary_4_chart_generation.md
│   ├── summary_5_chat_integration.md
│   ├── summary_6_ai_service.md
│   ├── summary_7_token_management.md
│   ├── summary_8_payment_system.md
│   ├── summary_9_frontend_ui.md
│   └── summary_10_testing_deployment.md
├── docs/
│   ├── architecture.md
│   ├── api_documentation.md
│   └── deployment_guide.md
├── backend/
├── frontend/
└── shared/
```

## Workflow Instructions

### Phase Execution
1. Read the current prompt file from `prompts/prompt_X.md`
2. Execute the instructions in the prompt
3. Create a detailed summary in `summaries/summary_X.md`
4. Move to the next phase

### Summary Format
Each summary file should include:
- **Completed Tasks**: What was implemented
- **Files Created/Modified**: List of files with brief description
- **Key Decisions**: Important architectural or technical decisions
- **Dependencies**: New packages installed or external services integrated
- **Next Steps**: Preparation for the next phase
- **Issues/Notes**: Any problems encountered or important notes

### Automation Commands
```bash
# Execute a specific phase
claude-code "$(cat prompts/prompt_1_research_analysis.md)"

# After execution, create summary
claude-code "Create a detailed summary of what was just completed and save it to summaries/summary_1_research_analysis.md following the format specified in CLAUDE.md"
```

## Development Phases

### Phase 1: Research & Analysis
- Study open-source templates and solutions
- Analyze Vietnamese astrology requirements
- Create project architecture plan

### Phase 2: Foundation Setup
- Initialize project structure
- Set up development environment
- Configure basic tooling

### Phase 3: Authentication System
- Implement JWT-based authentication
- Set up user registration and login
- Add Vietnamese-specific validations

### Phase 4: Chart Generation
- Implement Vietnamese astrology algorithms
- Create lunar calendar conversion
- Build chart generation service

### Phase 5: Chat Integration
- Set up Socket.io real-time communication
- Create chat interface foundation
- Implement message handling

### Phase 6: AI Service
- Integrate OpenAI API
- Create astrology consultation logic
- Implement AI response processing

### Phase 7: Token Management
- Build token/credit system
- Implement transaction logging
- Create balance management

### Phase 8: Payment System
- Integrate Stripe payment processing
- Set up Vietnamese payment methods
- Implement purchase workflows

### Phase 9: Frontend UI
- Create React components with Material-UI
- Build astrology chart visualization
- Implement responsive design

### Phase 10: Testing & Deployment
- Set up testing infrastructure
- Create deployment configuration
- Performance optimization

## Quality Standards

### Code Quality
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Comprehensive error handling
- Detailed logging and monitoring

### Security Requirements
- JWT token security best practices
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure payment processing

### Performance Standards
- Page load time < 3 seconds
- Chart generation < 5 seconds
- AI response time < 10 seconds
- Support 1000+ concurrent users

### Vietnamese Localization
- Vietnamese language support
- Cultural adaptations for astrology
- Local payment method integration
- Vietnamese date and time formats

## External Resources

### Open-Source Templates
- JWT Authentication: https://github.com/singhpradip/JWT-Authentication-API-with-Node.js-and-Express
- Chat System: https://github.com/OmarElGabry/chat.io
- Socket.io Guide: https://socket.io/get-started/chat

### Domain Knowledge
- Vietnamese Astrology: https://tuvi.cohoc.net
- Chart Generation: https://tuvi.cohoc.net/cach-an-sao-lap-thanh-la-so-tu-vi-tren-giay-nid-1664.html

### Documentation
- DeepWiki Research: https://deepwiki.com
- Express Security: https://expressjs.com/en/advanced/best-practice-security.html
- Material-UI: https://mui.com/

## Success Criteria

### Technical Success
- All 10 phases completed successfully
- Full Vietnamese astrology functionality
- Real-time AI chat integration
- Complete payment and token system
- Production-ready deployment

### Business Success
- User-friendly Vietnamese interface
- Accurate astrology calculations
- Seamless payment experience
- Scalable architecture for growth
- Cultural authenticity in astrology consultations

## Getting Started

To begin the development process:

```bash
# Start with Phase 1
claude-code "$(cat prompts/prompt_1_research_analysis.md)"
```

After each phase completion, review the generated summary and ensure all requirements are met before proceeding to the next phase.