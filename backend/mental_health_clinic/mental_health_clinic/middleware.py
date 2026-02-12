class RemoveServerHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # Remove the 'Server' header if it exists to hide version info
        if response.has_header('Server'):
            del response['Server']
        return response