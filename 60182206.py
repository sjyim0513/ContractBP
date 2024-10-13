class PriorityQueue:
    def __init__(self):
        self.heap = []

    def push(self, priority, item):
        self.heap.append((priority, item))
        self._sift_up(len(self.heap) - 1)

    def pop(self):
        if len(self.heap) == 0:
            raise IndexError("pop from an empty priority queue")

        self._swap(0, len(self.heap) - 1)
        item = self.heap.pop()
        self._sift_down(0)
        return item

    def _sift_up(self, idx):
        parent = (idx - 1) // 2
        if idx > 0 and self.heap[idx][0] < self.heap[parent][0]:
            self._swap(idx, parent)
            self._sift_up(parent)

    def _sift_down(self, idx):
        left = 2 * idx + 1
        right = 2 * idx + 2
        smallest = idx

        if left < len(self.heap) and self.heap[left][0] < self.heap[smallest][0]:
            smallest = left
        if right < len(self.heap) and self.heap[right][0] < self.heap[smallest][0]:
            smallest = right

        if smallest != idx:
            self._swap(idx, smallest)
            self._sift_down(smallest)

    def _swap(self, i, j):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]

    def is_empty(self):
        return len(self.heap) == 0


pq = PriorityQueue()
pq.push(9, 'task 9')
pq.push(1, 'task 1')
pq.push(3, 'task 3')
pq.push(2, 'task 2')
pq.push(4, 'task 4')
pq.push(7, 'task 7')
pq.push(5, 'task 5')

print(pq.pop())
print(pq.pop())
print(pq.pop())
