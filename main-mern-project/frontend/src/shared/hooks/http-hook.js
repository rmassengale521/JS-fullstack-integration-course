import { useCallback, useEffect, useRef, useState } from "react"


export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const activeHttpRequests = useRef([])

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true)
        const httpAbortCtrll = new AbortController()
        activeHttpRequests.current.push(httpAbortCtrll)

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrll.signal
            })

            const data = await response.json()

            activeHttpRequests.current = activeHttpRequests.current.filter(req => req !== httpAbortCtrll)

            if (!response.ok) {
                throw new Error(data.message)
            }

            setIsLoading(false)

            return data
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
            throw err
        }
    }, [])

    const clearError = () => {
        setError(null)
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrll => abortCtrll.abort())
        }
    }, [])

    return { isLoading, error, sendRequest, clearError }
}