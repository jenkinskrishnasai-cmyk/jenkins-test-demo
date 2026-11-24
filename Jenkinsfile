pipeline {
    agent any

    triggers {
        // Check GitHub every minute for new commits.
        // (A GitHub webhook can't reach Jenkins on localhost.)
        pollSCM('* * * * *')
    }

    parameters {
        booleanParam(name: 'MAKE_UNSTABLE', defaultValue: false,
                     description: 'Failing tests = UNSTABLE (yellow) instead of FAILURE (red)')
    }

    environment {
        // Zscaler certificate for npm, and a writable npm cache in the workspace
        NODE_EXTRA_CA_CERTS = "${WORKSPACE}/corp-root.crt"
        npm_config_cache    = "${WORKSPACE}/.npm"
    }

    stages {
        stage('Prepare') {
            steps {
                sh 'cp /usr/local/share/ca-certificates/corp-root.crt .'
            }
        }

        stage('Install') {
            agent {
                docker {
                    image 'node:14-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install --no-audit --no-fund'
            }
        }

        stage('Unit tests') {
            agent {
                docker {
                    image 'node:14-alpine'
                    reuseNode true
                }
            }
            steps {
                script {
                    if (params.MAKE_UNSTABLE) {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                            sh 'npm test'
                        }
                    } else {
                        sh 'npm test'
                    }
                }
            }
            post {
                always {
                    junit testResults: 'reports/junit.xml', allowEmptyResults: true
                }
            }
        }

        stage('Build') {
            steps {
                echo 'ng build would run here'
            }
        }
    }
}
