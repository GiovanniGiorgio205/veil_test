'use client'

import type React from 'react'

import {
	HealthIndicator,
	type IndicatorPosition,
} from '@/components/health-indicator'
import { createContext, useContext, useEffect, useState } from 'react'

type HealthIndicatorContextType = {
	visible: boolean
	setVisible: (visible: boolean) => void
	position: IndicatorPosition
	setPosition: (position: IndicatorPosition) => void
}

const HealthIndicatorContext = createContext<
	HealthIndicatorContextType | undefined
>(undefined)

export function useHealthIndicator() {
	const context = useContext(HealthIndicatorContext)
	if (!context) {
		throw new Error(
			'useHealthIndicator must be used within a HealthIndicatorProvider'
		)
	}
	return context
}

export function HealthIndicatorProvider({
	children,
	pollingInterval = 30000,
}: {
	children: React.ReactNode
	pollingInterval?: number
}) {
	// Load preferences from localStorage
	const [visible, setVisible] = useState(true)
	const [position, setPosition] = useState<IndicatorPosition>('bottom-right')
	const [initialized, setInitialized] = useState(false)

	// Load saved preferences on mount
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedVisible = localStorage.getItem('healthIndicatorVisible')
			const savedPosition = localStorage.getItem(
				'healthIndicatorPosition'
			) as IndicatorPosition | null

			if (savedVisible) setVisible(savedVisible === 'true')
			if (savedPosition) setPosition(savedPosition)
		}
	}, [])

	// Save preferences when they change
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('healthIndicatorVisible', visible.toString())
			localStorage.setItem('healthIndicatorPosition', position)
		}
	}, [visible, position])

	// Initialize health checks on the client side
	useEffect(() => {
		const initializeChecks = async () => {
			try {
				console.log('Initializing health checks from provider...')
				const { initializeHealthChecks } = await import('@/lib/health')
				initializeHealthChecks()
				setInitialized(true)
				console.log('Health checks initialized from provider')
			} catch (error) {
				console.error('Failed to initialize health checks:', error)
			}
		}

		if (!initialized) {
			initializeChecks()
		}
	}, [initialized])

	return (
		<HealthIndicatorContext.Provider
			value={{ visible, setVisible, position, setPosition }}
		>
			{children}
			{visible && initialized && (
				<HealthIndicator
					pollingInterval={pollingInterval}
					position={position}
				/>
			)}
		</HealthIndicatorContext.Provider>
	)
}
