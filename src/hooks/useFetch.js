import { useState } from "react"

export const useFetch = (callback) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetching = async () => {
        try{
            setIsLoading(true)
            await callback()
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false)
        }
    }
    return [fetching, isLoading, error]
}