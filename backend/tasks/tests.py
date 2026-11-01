from datetime import date, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Task


class TaskAPITests(APITestCase):

    def setUp(self):
        self.task = Task.objects.create(
            title="Initial Test Task",
            description="Initial Description",
            status=Task.StatusChoices.TODO,
            priority=Task.PriorityChoices.MEDIUM,
            due_date=date.today() + timedelta(days=5),
        )
        self.list_url = reverse('task-list')
        self.detail_url = reverse('task-detail', args=[self.task.id])

    def test_list_tasks(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Initial Test Task")

    def test_create_task(self):
        payload = {
            "title": "New Task via API",
            "description": "API created description",
            "status": "IN_PROGRESS",
            "priority": "HIGH",
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], "New Task via API")
        self.assertEqual(response.data['status'], "IN_PROGRESS")
        self.assertEqual(response.data['priority'], "HIGH")
        self.assertIn('id', response.data)
        self.assertIn('created_at', response.data)
        self.assertIn('updated_at', response.data)

    def test_retrieve_task(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.task.id)
        self.assertEqual(response.data['title'], "Initial Test Task")

    def test_update_task(self):
        payload = {
            "title": "Updated Task Title",
            "description": "Updated Description",
            "status": "DONE",
            "priority": "LOW",
        }
        response = self.client.put(self.detail_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Updated Task Title")
        self.assertEqual(response.data['status'], "DONE")

    def test_partial_update_task(self):
        payload = {"status": "DONE"}
        response = self.client.patch(self.detail_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], "DONE")
        self.assertEqual(response.data['title'], "Initial Test Task")

    def test_delete_task(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)

    def test_create_task_validation_error(self):
        # Missing required title
        payload = {"description": "No title provided"}
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_create_task_whitespace_title_error(self):
        # Whitespace-only title
        payload = {"title": "    "}
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)

    def test_filter_by_status(self):
        Task.objects.create(title="Done Task", status=Task.StatusChoices.DONE)
        response = self.client.get(f"{self.list_url}?status=DONE")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['status'], Task.StatusChoices.DONE)

    def test_filter_by_priority(self):
        Task.objects.create(title="High Priority Task", priority=Task.PriorityChoices.HIGH)
        response = self.client.get(f"{self.list_url}?priority=HIGH")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['priority'], Task.PriorityChoices.HIGH)

    def test_search_tasks(self):
        Task.objects.create(title="UniqueKeyword Meeting", description="Notes")
        response = self.client.get(f"{self.list_url}?search=UniqueKeyword")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "UniqueKeyword Meeting")

    def test_ordering_tasks(self):
        Task.objects.create(title="Alpha", due_date=date.today() + timedelta(days=1))
        Task.objects.create(title="Beta", due_date=date.today() + timedelta(days=10))
        response = self.client.get(f"{self.list_url}?ordering=due_date")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [item['title'] for item in response.data if item['due_date']]
        self.assertEqual(titles[0], "Alpha")

    def test_pagination(self):
        for i in range(12):
            Task.objects.create(title=f"Bulk Task {i}")
        response = self.client.get(f"{self.list_url}?page=1&page_size=5")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 5)
