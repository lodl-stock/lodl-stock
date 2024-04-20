# Changelog

All notable changes to this project will be documented in this file.

Changes are prefaced by contributor initials:

- Maria Teaca: MT
- Stefan Pantucu: SP

## [0.0.4] - 2024-04-20

### Added

- [MT] Stock fetching functionality to the database
- [SP] Login and register functionality to the authentication service.
- [MT] Route for checking autorization of a request to the authentication service.
- [MT] This CHANGELOG file.

### Changed

- [MT] Product stock is now managed using StoreProductInstance for easier atomic
  changes.
- [MT] Dockerfiles now generate prisma types at build time.
- [MT] Schema changes are pushed when container comes online.

### Fixed

- [SP] docker compose file was left broken by a rebase.

## [0.0.3] - 2024-04-11

### Added

- [MT] Email alerts in the subscription mailing service (by leveraging a cronjob)
- [MT] Stores and StoreProduct as database entities

### Changed

- [MT] Moved schema.prisma to project root so it can be used by all three services
  without conflicts


## [0.0.2] - 2024-04-04

### Added

- [MT] Base functionalities to the subscription mailing service.
- [SP] Basic structure to the business service.

## [0.0.1] - 2024-04-04

### Added

- [MT] Dockerfiles and docker compose file for the app services.
- [SP] Database and database management server to docker compose file.
