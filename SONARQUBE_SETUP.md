# SonarQube Setup Guide

## Prerequisites
- Docker installed on your machine
- Docker Compose installed

## Starting SonarQube

1. Start the SonarQube container:
```bash
docker-compose up -d
```

2. Wait for SonarQube to start (usually takes 1-2 minutes). Check the logs:
```bash
docker-compose logs -f sonarqube
```

3. Access SonarQube at: http://localhost:9000

4. Default credentials:
   - Username: `admin`
   - Password: `admin`
   - You'll be prompted to change the password on first login

## Creating Your Project in SonarQube

**IMPORTANT: Do this BEFORE running your first analysis**

1. Log in to SonarQube at http://localhost:9000
2. Click "Create Project" (or "+" button)
3. Choose "Manually"
4. Enter:
   - **Project key**: `line-g99-paid-pawn` (must match sonar-project.properties)
   - **Display name**: `Line G99 Paid Pawn`
5. Click "Set Up"
6. Choose "Locally"
7. Generate a token (or use your existing token)
8. Select "Other" as your project type
9. Select your OS

## Running Analysis

### Option 1: Using SonarScanner (Recommended)

1. Install SonarScanner:
   - Download from: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
   - Or use npm: `npm install -g sonarqube-scanner`

2. Generate a token in SonarQube (if you haven't already):
   - Go to My Account > Security > Generate Token
   - Save the token

3. Run the analysis:
```bash
sonar-scanner -Dsonar.token=YOUR_TOKEN_HERE
```

### Option 2: Using Docker

```bash
docker run --rm --network host -v "%cd%:/usr/src" sonarsource/sonar-scanner-cli -Dsonar.projectKey=line-g99-paid-pawn -Dsonar.sources=src -Dsonar.host.url=http://localhost:9000 -Dsonar.login=YOUR_TOKEN_HERE
```

## Stopping SonarQube

```bash
docker-compose down
```

## Removing All Data (Clean Start)

```bash
docker-compose down -v
```

## Configuration

The project configuration is stored in `sonar-project.properties`. You can modify:
- Source directories
- Exclusion patterns
- Code coverage report paths
- Other project-specific settings

## Troubleshooting

### Container won't start
- Check if port 9000 is already in use
- Ensure Docker has enough memory (at least 2GB recommended)

### Analysis fails
- Verify the token is correct
- Check that the SonarQube server is running
- Ensure the project key matches in both SonarQube and sonar-project.properties
