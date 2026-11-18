// line-g99-paid-pawn (React + Vite, LINE LIFF) — build in Docker on apd.local, deploy to file.drugnetcenter.com.
// Modelled on g99analytic/Jenkinsfile. Replaces the hand-run deploy.sh / deploy.ps1 (scp from a laptop).
// Multibranch: every branch & PR is tested + built + archived; only `prod` deploys (no approval gate —
// pushing prod deploys):
//   branch prod → g99pawnpay-customer.golden99.co.th   (/var/www/g99pawnpay-customer/html)
//
// Build-time config (VITE_*) is NOT in git: it is the Jenkins "Secret file" credential ENV_CRED, copied to
// .env.production.local (gitignored, highest priority for `vite build`) for the build and deleted after.
// Every VITE_* value still ends up in the public JS bundle — keeping it in Jenkins only keeps it out of git.
//
// ⚠ One-time server prerequisite: the sudo-free swap (mv html → html.bak) needs user `px` to own the
//   PARENT folder /var/www/g99pawnpay-customer/ — otherwise mv fails with EACCES.
//
// Agent: apd.local, the same Docker build agent as g99analytic (it already reaches
// file.drugnetcenter.com:5333 with the px-file-drugnetcenter key).
//
// Notes:
//   • `npm run build` = tsc -b && vite build → output in dist/ (base: './' so assets are relative)
//   • Unit tests (vitest) gate the build, as deploy.sh did: a red test means no artifact and no deploy
//   • Node 24, same as g99analytic and local dev (Vite 7 needs >= 20.19)
pipeline {
  agent { label 'apd.local' }           // Jenkins node = apd.local (has Docker; jenkins user in docker group)

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '15'))
  }

  environment {
    NODE_IMAGE  = 'node:24'
    DIST_DIR    = 'dist'
    DEPLOY_HOST = 'px@file.drugnetcenter.com'
    DEPLOY_PORT = '5333'
    SSH_CRED    = 'px-file-drugnetcenter'
    DEPLOY_PATH = '/var/www/g99pawnpay-customer/html'
    ENV_CRED    = 'line-g99-paid-pawn-env-prod'          // Secret file credential = the prod .env
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Test & Build (Docker)') {
      // Run as the jenkins uid/gid with HOME + npm cache UNDER the mounted workspace (/app) so they're
      // writable by that uid and nothing lands root-owned (cleanWs works). The `docker run` is ONE line
      // on purpose: backslash continuations inside a Groovy '''...''' string get mangled.
      // Every branch builds with the prod env file, so any archived dist/ is a deployable build.
      steps {
        withCredentials([file(credentialsId: "${ENV_CRED}", variable: 'APP_ENV_FILE')]) {
          sh '''
            set -e
            # strip CR in case the file was uploaded from Windows
            tr -d '\\r' < "$APP_ENV_FILE" > .env.production.local
            # fail fast: a missing value builds fine but ships a broken app
            for k in VITE_LIFF_ID VITE_BASE_URL VITE_SURVEY_API_URL VITE_APP_VERSION; do
              grep -Eq "^${k}=.+" .env.production.local || { echo "credential ${ENV_CRED} has no value for ${k}"; exit 1; }
            done
          '''
        }
        sh '''
          set -e
          mkdir -p "${WORKSPACE}/.home" "${WORKSPACE}/.npm"
          docker run --rm -u $(id -u):$(id -g) -e HOME=/app/.home -e npm_config_cache=/app/.npm -e CI=true -v "${WORKSPACE}:/app" -w /app ${NODE_IMAGE} bash -c "node -v && npm -v && npm ci --no-audit --no-fund && npm test -- --run && npm run build"
          test -f "${DIST_DIR}/index.html"
        '''
      }
      post {
        always { sh 'rm -f .env.production.local' }
      }
    }

    stage('Archive') {
      // Convenience only — must not block Deploy.
      steps {
        catchError(message: 'archiveArtifacts failed — continuing', buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
          archiveArtifacts artifacts: "${DIST_DIR}/**", fingerprint: true
        }
      }
    }

    stage('Deploy') {
      when { branch 'prod' }
      steps {
        echo "Deploying PROD (g99pawnpay-customer.golden99.co.th) -> ${DEPLOY_HOST}:${DEPLOY_PATH}"
        // Each ssh/scp is ONE line — backslash continuations get eaten by the Groovy '''...''' string.
        withCredentials([sshUserPrivateKey(credentialsId: "${SSH_CRED}", keyFileVariable: 'SSH_KEY')]) {
          sh '''
            set -e
            # Use ONLY the -i key: IdentityAgent=none ignores any ssh-agent on the node and
            # IdentitiesOnly=yes ignores default keys (else "Too many authentication failures").
            SSHOPT="-o IdentityAgent=none -o IdentitiesOnly=yes -o PreferredAuthentications=publickey -o StrictHostKeyChecking=accept-new"
            SSH="ssh -i $SSH_KEY -p ${DEPLOY_PORT} $SSHOPT"
            # atomic-ish swap: upload to .new, swap into place, keep .bak for rollback
            $SSH ${DEPLOY_HOST} "rm -rf ${DEPLOY_PATH}.new && mkdir -p ${DEPLOY_PATH}.new"
            scp -i $SSH_KEY -P ${DEPLOY_PORT} $SSHOPT -r ${DIST_DIR}/* ${DEPLOY_HOST}:${DEPLOY_PATH}.new/
            # nginx (www-data) must be able to read everything (the old Windows scp left 700 dirs behind)
            $SSH ${DEPLOY_HOST} "chmod -R a+rX ${DEPLOY_PATH}.new && test -f ${DEPLOY_PATH}.new/index.html"
            $SSH ${DEPLOY_HOST} "rm -rf ${DEPLOY_PATH}.bak; [ -d ${DEPLOY_PATH} ] && mv ${DEPLOY_PATH} ${DEPLOY_PATH}.bak; mv ${DEPLOY_PATH}.new ${DEPLOY_PATH}"
            # Rollback (remote): mv html html.broken && mv html.bak html
          '''
        }
      }
    }
  }

  post {
    always { cleanWs() }
  }
}
