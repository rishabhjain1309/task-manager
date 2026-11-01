from rest_framework.pagination import PageNumberPagination


class TaskPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        """
        Paginates when 'page' or 'page_size' query parameters are passed.
        Returns unpaginated queryset when omitted to remain backward compatible
        with frontend consumers expecting direct list arrays.
        """
        if 'page' not in request.query_params and 'page_size' not in request.query_params:
            return None
        return super().paginate_queryset(queryset, request, view)

