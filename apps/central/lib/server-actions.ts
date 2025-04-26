'use server'

export async function verifyRedirect(url: string) {
    // Ensure the URL is properly formatted
    let targetUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        targetUrl = `http://${url}`;
    }
    
    // Remove trailing slash if present
    targetUrl = targetUrl.replace(/\/$/, '');
    
    try {
        const response = await fetch(`${targetUrl}/api/auth/check-redirect`, {
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            return { 
                success: false, 
                error: `Failed to get verification token. Status: ${response.status}`
            };
        }
        
        const { token } = await response.json();
        
        if (!token) {
            return { 
                success: false, 
                error: 'No token received from redirect verification'
            };
        }
        
        // Verify the token with our local API
        const verifyResponse = await fetch('/api/auth/check-redirect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
        
        if (!verifyResponse.ok) {
            return { 
                success: false, 
                error: `Verification failed. Status: ${verifyResponse.status}`
            };
        }
        
        const { isValid } = await verifyResponse.json();
        
        if (!isValid) {
            return { 
                success: false, 
                error: 'Invalid verification token'
            };
        }
        
        return { success: true };
    } catch (error) {
        // Handle fetch errors specifically
        if (error instanceof TypeError && error.message === 'fetch failed') {
            console.log('Fetch error:', error)
            return {
                success: false,
                error: 'Could not connect to the redirect URL. Please check if the URL is correct and accessible.'
            };
        }
        return {
            success: false,
            error: 'An unexpected error occurred while verifying the redirect URL'
        };
    }
}