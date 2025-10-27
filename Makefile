.PHONY: help install dev build lint format test clean docker-up docker-down db-migrate db-reset db-seed setup

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	pnpm install

dev: ## Start development servers
	pnpm dev

build: ## Build all apps
	pnpm build

lint: ## Lint all code
	pnpm lint

format: ## Format all code
	pnpm format

test: ## Run tests
	pnpm test

test-e2e: ## Run e2e tests
	pnpm test:e2e

clean: ## Clean all build artifacts and node_modules
	pnpm clean

docker-up: ## Start Docker services
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

db-migrate: ## Run database migrations
	pnpm db:migrate

db-reset: ## Reset database
	pnpm db:reset

db-seed: ## Seed database
	pnpm db:seed

db-studio: ## Open Prisma Studio
	pnpm db:studio

setup: ## Complete setup (install, docker, migrate, seed)
	pnpm setup
