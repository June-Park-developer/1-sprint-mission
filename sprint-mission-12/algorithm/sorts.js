// Selection Sort
function selectionSort(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    const currentMin = numbers[i];
    let minIndex = i;
    for (let j = i + 1; j < numbers.length; j++) {
      const candidateMin = numbers[j];
      if (currentMin > candidateMin) {
        minIndex = j;
      }
    }
    numbers[i] = numbers[minIndex];
    numbers[minIndex] = currentMin;
  }
  return numbers;
}

console.log(`선택 정렬 : ${selectionSort([1, 3, 2, 5, 4, 7])}`);

// Insertion Sort
function insertionSort(numbers) {
  for (let i = 1; i < numbers.length; i++) {
    const currentNum = numbers[i];
    let filled = false;
    for (let j = i - 1; j >= 0; j--) {
      if (numbers[j] > currentNum) {
        numbers[j + 1] = numbers[j];
      } else {
        numbers[j + 1] = currentNum;
        filled = true;
        break;
      }
    }
    if (!filled) {
      numbers[0] = currentNum;
    }
  }
  return numbers;
}

console.log(`삽입 정렬 : ${insertionSort([1, 3, 2, 5, 4, 7])}`);

// Merge Sort
function mergeSort(numbers) {
  // 0. base case : 더 나눌 수 없는 경우
  if (numbers.length <= 1) {
    return numbers;
  }

  // 1. divide
  const mid = Math.floor(numbers.length / 2);
  let left = numbers.slice(0, mid);
  let right = numbers.slice(mid);
  // 2. conquer
  left = mergeSort(left);
  right = mergeSort(right);
  // 3. combine
  return merge(left, right);
}

// combine의 헬퍼함수
function merge(left, right) {
  const sorted = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      sorted.push(left[leftIndex]);
      leftIndex++;
    } else {
      sorted.push(right[rightIndex]);
      rightIndex++;
    }
  }
  sorted.push(...left.slice(leftIndex));
  sorted.push(...right.slice(rightIndex));
  return sorted;
}
console.log(`머지 정렬 : ${mergeSort([1, 3, 2, 5, 4, 7])}`);

// Quick Sort
function quickSort(numbers) {
  if (numbers.length <= 1) {
    return numbers;
  }
  const pivot = numbers[numbers.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] > pivot) {
      right.push(numbers[i]);
    } else {
      left.push(numbers[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(`  퀵 정렬 : ${quickSort([1, 3, 2, 5, 4, 7])}`);

// Quick Sort2 - 제자리에서 swap 하는 형태
function quickSortSwap(numbers, start = 0, end = numbers.length - 1) {
  if (numbers.length <= 1) {
    return numbers;
  }
  const pivotIndex = partition(numbers, 0, end);
  quickSortSwap(numbers, start, pivotIndex - 1);
  quickSortSwap(numbers, pivotIndex, end);
  return numbers;
}

function partition(numbers, start, end) {
  const pivot = numbers[end];
  let left = start;
  let right = end - 1;

  while (left < right) {
    while (numbers[left] < pivot && left <= end) {
      left++;
    }
    while (numbers[right] > pivot && right >= start) {
      right--;
    }
    if (left < right) {
      swap(numbers, left, right);
    }
  }
  swap(numbers, left, end);
  return left;
}

function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

console.log(` 퀵 정렬2 : ${quickSort([1, 3, 2, 5, 4, 7])}`);
