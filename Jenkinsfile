pipeline {
    agent any 
    
    tools {
        nodejs 'Node18' 
    }
    
    environment {
        REGISTRY = 'ghcr.io' 
        // CORREGIDO: Todo el nombre de la imagen en minúsculas como lo exige Docker
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
                    // Mantenemos tu usuario original en el login web, pero la ruta en minúsculas
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
            echo ' 🎉  Pipeline completado exitosamente!' [cite: 169]
            // Notificación real usando la configuración global de tu Jenkins
            emailext (
                subject: " ✅  Pipeline Success: \${JOB_NAME} - \${BUILD_NUMBER}", [cite: 171]
                body: "Hola Cristian,\n\nEl pipeline de Docker se ha completado de forma exitosa de principio a fin.\n\nImagen publicada en GHCR: ${IMAGE_TAG_COMMIT}", [cite: 172]
                to: 'crispis111102@gmail.com'
            )
        }
        failure {
            echo ' ❌  Pipeline falló!' [cite: 177]
            // Alerta real en caso de que alguna etapa marque error
            emailext (
                subject: " ❌  Pipeline Failed: \${JOB_NAME} - \${BUILD_NUMBER}", [cite: 179]
                body: "El pipeline de Docker ha fallado en alguna de sus etapas. Revisa los logs en la interfaz para solucionar el problema.", [cite: 180]
                to: 'crispis111102@gmail.com'
            )
        }
        cleanup {
            echo ' 🧹  Limpiando recursos...' [cite: 185]
            script {
                sh "docker image prune -f" [cite: 189]
            }
        }
    }
}