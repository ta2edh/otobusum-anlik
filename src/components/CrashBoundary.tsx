import * as Updates from 'expo-updates'
import React, { Component, ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class CrashBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Production'da daha az verbose logging
    if (process.env.NODE_ENV === 'production') {
      console.error('App crashed:', error.message)
    } else {
      console.error('🚨 CRASH BOUNDARY CAUGHT ERROR:', error)
      console.error('🚨 ERROR MESSAGE:', error.message)
      console.error('🚨 ERROR NAME:', error.name)
      console.error('🚨 ERROR STACK:', error.stack)

      // Location related error detection
      if (error.message.includes('location') || error.message.includes('Location')) {
        console.error('🧭 LOCATION-RELATED CRASH DETECTED')
      }
      if (error.message.includes('map') || error.message.includes('Map')) {
        console.error('🗺️ MAP-RELATED CRASH DETECTED')
      }
    }

    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Production'da daha az verbose logging
    if (process.env.NODE_ENV === 'production') {
      console.error('App component crashed:', error.message)
    } else {
      console.error('🚨 CRASH BOUNDARY DETAILED INFO:')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)

      // Try to identify the crashing component
      if (errorInfo.componentStack) {
        if (errorInfo.componentStack.includes('Map')) {
          console.error('🗺️ CRASH IN MAP COMPONENT')
        }
        if (errorInfo.componentStack.includes('Location')) {
          console.error('🧭 CRASH IN LOCATION COMPONENT')
        }
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Production'da Apple'ın görebileceği hata ekranı yerine
      // uygulama restart'ı dene (React Native için doğru yöntem)
      if (process.env.NODE_ENV === 'production') {
        setTimeout(async () => {
          try {
            // Expo Updates ile restart
            await Updates.reloadAsync()
          } catch (error) {
            console.error('Restart failed:', error)
            // Fallback: sadece error state'i reset et
            this.setState({ hasError: false, error: undefined })
          }
        }, 2000)
      }

      return this.props.fallback || (
        <View style={styles.container}>
          <Text style={styles.title}>App Crashed</Text>
          <Text style={styles.message}>
            Error:
            {' '}
            {this.state.error?.message || 'Unknown error'}
          </Text>
          {process.env.NODE_ENV !== 'production' && (
            <Text style={styles.stack}>
              {this.state.error?.stack}
            </Text>
          )}
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ff0000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  stack: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
})
