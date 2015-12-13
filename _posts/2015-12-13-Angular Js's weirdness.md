---
layout: post
published: true
title: Angular JS's ng-if and watches
excerpt: a *cough* bug that got me  
main: true
---

I am currently working on a reading list based on NLP, where people can search for topics and get relevant and similar documents. I added a checkbox that toggles displaying all the documents. I was watching on the model 'isSelectAll' 

{% highlight html %}
<div class="switch">
    <label>
        De-select All
        <input type="checkbox" ng-model="isSelectAll">
        <span class="lever"></span>
        Select All
    </label>
</div>
{% endhighlight %}        
 
{% highlight javascript %}
$scope.$watch('isSelectAll', function (newVal) {
    if ($scope.matchedTopics) {
        if (newVal) {
            $scope.selectAll();
        } else {
            $scope.deSelectAll();
        }
    }
});
{% endhighlight %}

But for some reason the watch was not getting triggered when I clicked on the checkbox. That was almost impossible, I was breaking my head for a few hours and then finally figured out why. 

I had a search bar which gets the documents based on query, and before fetch, all the other elements were under ng-if false. This makes those elements render only after getting data.

{% highlight html %}
<div class="row" ng-if="matchedTopics.length">
    <!-- everything including checkbox -->
</div>
{% endhighlight %}

Turns out, apart from creating the html elements(which makes sense), the two way bindings are also not setup. So if some elements are under ng-if false and later becomes true, the bindings are messed up.

So to overcome this I had to make ng-if to ng-show. But I just thought that ng-if improves performance by not rendering contents till they are needed. Oh well ng-show wins this time. 