import { useEffect, useState } from 'react'

const useAlert = (state: string | null) => {
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        if (state !== 'Don’t_know' && state) {
            setShowAlert(true)

            const timer = setTimeout(() => {
                setShowAlert(false)
            }, 30000)

            return () => clearTimeout(timer)
        }
    }, [state])

    return showAlert
}

export default useAlert