pipeline {
    agent any 
    
    tools {
        nodejs 'Node18' 
    }
    
    environment {
        REGISTRY = 'ghcr.io' 
        IMAGE_NAME = 'crisisa200211/mi-app-docker' 
        
        COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim() 
        BUILD_TIMESTAMP = sh(script: 'date +%Y%m%d-%H%M%S', returnStdout: true).trim() 
        
        IMAGE_TAG_LATEST = "${REGISTRY}/${IMAGE_NAME}:latest" 
        IMAGE_TAG_COMMIT = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_SHA}" 
        IMAGE_TAG_BUILD  = "${REGISTRY}/${IMAGE_NAME}:build-${BUILD_TIMESTAMP}" 
    }
    
    stages {
        // STAGE 1: Preparación
        stage('Prepare') {
            steps {
                echo ' Preparando entorno...' 
                sh 'docker --version' 
                sh 'node --version' 
                sh 'npm --version' 
            }
        }
        
        // STAGE 2: Instalación de Dependencias
        stage('Install Dependencies') {
            steps {
                echo ' 📥  Instalando dependencias...' 
                sh 'npm install' 
            }
        }
        
        // STAGE 3: Ejecutar Tests
        stage('Test') {
            steps {
                echo ' 🧪  Ejecutando tests...' 
                sh 'npm test' 
            }
            post {
                always {
                    junit 'test-results/**/*.xml' 
                }
            }
        }
        
        // STAGE 4: Construcción de Imagen Docker
        stage('Build Docker Image') {
            steps {
                echo ' 🐳  Construyendo imagen Docker...' 
                script {
                    docker.build("${IMAGE_TAG_COMMIT}") 
                }
            }
        }
        
        // STAGE 5: Publicación en Registro
        stage('Push to Registry') {
            steps {
                echo ' 📤  Publicando imagen en GitHub Container Registry...' 
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) { 
                    sh '''
                        echo $GITHUB_TOKEN | docker login ghcr.io -u Crisisa200211 --password-stdin
                    ''' 
                    sh """
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_LATEST}
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_BUILD}
                    """ 
                    sh """
                        docker push ${IMAGE_TAG_COMMIT}
                        docker push ${IMAGE_TAG_LATEST}
                        docker push ${IMAGE_TAG_BUILD}
                    """ 
                }
            }
        }
        
        // STAGE 6: Verificación
        stage('Verify Published Image') {
            steps {
                echo ' ✅  Verificando imagen publicada...' 
                script {
                    sh """
                        echo " 📦  Imagen publicada: ${IMAGE_TAG_COMMIT}"
                        echo " 🏷 ️ Tags disponibles:"
                        echo "  - ${IMAGE_TAG_COMMIT}"
                        echo "  - ${IMAGE_TAG_LATEST}"
                        echo "  - ${IMAGE_TAG_BUILD}"
                    """ 
                }
            }
        }
    }
    
    post {
        success {
            echo ' 🎉  Pipeline completado exitosamente!' 
            // Usamos el comando nativo mail de tu práctica 1 que sí funciona de verdad
            mail to: 'crispis111102@gmail.com',
                 subject: " ✅ Pipeline Éxito: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Hola Cristian, tu pipeline de Docker terminó con éxito de principio a fin.\n\nImagen publicada en GHCR: ${IMAGE_TAG_COMMIT}"
        }
        failure {
            echo ' ❌  Pipeline falló!' 
            // Usamos el comando nativo mail para las alertas en caso de fallo
            mail to: 'crispis111102@gmail.com',
                 subject: " ❌ Pipeline Fallido: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "El pipeline de Docker falló en alguna etapa. Revisa el estado aquí: ${env.BUILD_URL}"
        }
        cleanup {
            echo ' 🧹  Limpiando recursos...' 
            script {
                sh "docker image prune -f" 
            }
        }
    }
}