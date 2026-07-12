pipeline {
    agent any
    
    environment {
        // Cambiado a GitHub Container Registry
        REGISTRY = 'ghcr.io' 
        
        // Formato obligatorio para GitHub: tu-usuario-github/nombre-del-repositorio
        IMAGE_NAME = 'Crisisa200211/mi-app-docker'
        
        // Captura el identificador del commit y el tiempo actual
        COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        BUILD_TIMESTAMP = sh(script: 'date +%Y%m%d-%H%M%S', returnStdout: true).trim()
        
        IMAGE_TAG_LATEST = "${REGISTRY}/${IMAGE_NAME}:latest"
        IMAGE_TAG_COMMIT = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_SHA}"
        IMAGE_TAG_BUILD  = "${REGISTRY}/${IMAGE_NAME}:build-${BUILD_TIMESTAMP}"
    }
    
    stages {
        stage('Prepare') {
            steps {
                echo ' 🐳 Comprobando entorno Docker...'
                sh 'docker --version'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo ' 📥 Instalando dependencias locales para verificación...'
                sh 'npm install' 
            }
        }
        
        stage('Test') {
            steps {
                echo ' 🧪 Ejecutando pruebas unitarias...'
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo ' 📦 Construyendo Imagen Docker...'
                sh "docker build -t ${IMAGE_TAG_COMMIT} ."
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main' 
            }
            steps {
                echo ' 📤 Publicando imagen en GitHub Container Registry (GHCR)...'
                
                // Usamos el ID 'github-token' que guardaste en el Paso 1 de la práctica
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    // Login usando el token en GHCR de forma segura
                    sh '''
                        echo $GITHUB_TOKEN | docker login ghcr.io -u Crisisa200211 --password-stdin
                    '''
                    
                    // Creamos los tags y los empujamos a GitHub
                    sh """
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_LATEST}
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_BUILD}
                        
                        docker push ${IMAGE_TAG_COMMIT}
                        docker push ${IMAGE_TAG_LATEST}
                        docker push ${IMAGE_TAG_BUILD}
                    """
                }
            }
        }
        
        stage('Verify Published Image') {
            when { branch 'main' }
            steps {
                echo " ✅ Imagen publicada con éxito en GitHub: ${IMAGE_TAG_COMMIT}"
            }
        }
    }
    
    post {
        success {
            echo ' 🎉 ¡Pipeline completado de inicio a fin exitosamente!'
        }
        failure {
            echo ' ❌ El pipeline falló en alguna de las etapas.'
        }
        cleanup {
            echo ' 🧹 Limpiando imágenes locales residuales...'
            sh "docker image prune -f"
        }
    }
}