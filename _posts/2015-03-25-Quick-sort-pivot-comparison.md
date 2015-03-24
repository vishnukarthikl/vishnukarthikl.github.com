---
layout: post
published: true
title: Quick sort pivot choose strategy
excerpt: Comparing the performance of quicksort with different pivot element choosing strategy
main: true
---

Quick sort works by choosing an element x from the list A and places x in the correct position in A (all the elements to the left of x is lesser and all the elements to the right of x are greater than x). Quick sort is again called on the left lesser list and the right greater list to sort them recursively.

Most of the work is done for moving x from its original position to the sorted position. The number of comparisons made with x and other elements of the list depends on the size of the list. If the recursion call had split the list perfectly into two, the work gets reduced by half at each level.

Work done at each level i is **`n/pow(2,i)`**
No of levels is **`log(n)`**
So the total work done is **`n * log(n)`**
This can also be derived from the [master theorem][1]

But that is the ideal case, Finding a perfect pivot element is not guaranteed. In order not to put too much work in finding the pivot element, let's see how different strategies affect the performance.

I am randomly generating a list of 1,000,000 numbers and sorting them by choosing a pivot from

    * first element
    * last element
    * median

You might think that finding median would be O(n), but this is a simplified version where we take the 2nd largest element comparing the first, middle, last element from the list (which takes O(1)).

Heuristically, you can see that there is almost **15%** less comparisons when the pivot is chosen using the median strategy.

{% highlight python %}
import random

def quick_sort(numbers, start, end, pivot_chooser):
        if start < end:
            pivot_index = pivot_chooser(numbers, start, end)
            numbers[start], numbers[pivot_index] = numbers[pivot_index], numbers[start]
            pivot = numbers[start]
            i = start
            for j in range(start, end + 1):
                if numbers[j] < pivot:
                    i += 1
                    numbers[i], numbers[j] = numbers[j], numbers[i]

            numbers[start], numbers[i] = numbers[i], numbers[start]
            return (end - start) + quick_sort(numbers, start, i - 1, pivot_chooser) + quick_sort(numbers, i + 1, end,
                                                                                                 pivot_chooser)
        else:
            return 0


def find_median_index(numbers, start, end):
        first = numbers[start], start
        last = numbers[end], end
        mid_index = (end - start) / 2 + start
        middle = numbers[mid_index], mid_index
        pivot_candidates = [first, middle, last]
        pivot_candidates.sort()
        return pivot_candidates[1][1]


numbers = random.sample(xrange(1000000), 1000000)
n1 = list(numbers)
n2 = list(numbers)
n3 = list(numbers)
print "First Element Pick %d" %quick_sort(n1, 0, len(n1) - 1, lambda _, start, end: start)
print "Last Element Pick %d" % quick_sort(n2, 0, len(n2) - 1, lambda _, start, end: end)
print "Median Element Pick %d" % quick_sort(n3, 0, len(n3) - 1, find_median_index)

{% endhighlight %}

Output:

```
First Element Pick 24620279
Last Element Pick 24409932
Median Element Pick 20920898
```

[1]: https://en.wikipedia.org/wiki/Master_theorem