---
layout: post
published: true
title: Dependency Injection
excerpt: Don't create, do inject
main: true
---


When I was doing my first project in my TWU(ThoughtWorks University) we were building a webapp and we used Spring framework. I would have heard the word 'dependency injection' 100 times/day. When I started out, I didn't know anything about it. I thought it must be some complicated thing because of its hip name. But later I found out it is so simple, yet so powerful.

Let's say we have a component Car and that needs(depends an engine)  Engine. We would normally create a Car with Engine and all the logic of creation of the Engine goes inside the Car. The Engine could be a complex component by itself having dependency on something else like fuel.

{% highlight java %}

public class Engine {
 private String type;
 private int horsePower;
 private int valve;

public Engine(String type, int horsePower, int valve) {
 this.type = type;
 this.horsePower = horsePower;
 this.valve = valve;
 }
}

public class Car {
 Engine engine;

public Car() {
 engine = new Engine("flat", 10, 1);
 }

public void drive() {
 //some drive logic using engine
 }
}

{% endhighlight %}
 

We create a Car with an Engine which has a set of properties. And we can start instantiating Car and get as many cars as we want.

{% highlight java %}
public class Main {
 public static void main(String[] args) {
 Car car = new Car();
 car.drive();
 }
}

{% endhighlight %}
But now our Car is tightly coupled with Engine, so if the implementation of the engine changes then our car would break. We would not want that to happen. And you have to change the Car's code if you wanted to create a car with a different Engine say a V8Engine.

Let's see how Dependency injection would solve our problem. Instead of creating an Engine inside the Car, inject it.

Don't Create. Do Inject.

{% highlight java %}

public class Main {
 public static void main(String[] args) {
 Engine engine = new Engine("V-type", 200, 8);
 Car car = new Car(engine);
 car.drive();
 }
}

{% endhighlight %}
{% highlight java %}

public class Car {
 Engine engine;

public Car(Engine engine) {
 this.engine = engine;
 }

public void drive() {
 //some drive logic
 }
}

{% endhighlight %}
So we can create all types of engine and pass it to the Car and the car would not have to be modified. So we have loosely coupled Car and Engine by removing the dependency of Car on Engine. This is a manual way to inject dependencies. But we can use Containers like spring to manage dependencies and inject them when ever someone needs it. So where ever Car needs some engine it would inject it. And that takes care of transitive dependencies also.

So when we are building multi tier architectural software, there would be a service which would need to use a DAO(Data Access Objects) and if we have tight coupling over it, we would have to change the service every time the type of database changes. So we use dependency injection to inject the required DAO Implementation.

And it would be very advisable to [Code to Interface][1]. So we can just ask for a Type rather than a concrete instance. It would be helpful to test also. We can inject mock objects during unit tests. Otherwise it is not even a unit test. So when we test a service we would not be actually making db calls, we would be mainly testing the service's logic and not how we get the data. So we can inject a mock repository as a DAO to it. We shall be looking into what mocks are in future posts.

There are several frameworks which does a great job at making dependency injection easy. I really like AngularJs' (client side MVC), dependency injection mechanism. It helps me to separate logical components as services and inject them whenever I need then.

So It is best to Code to Interface and use Dependency Injection to reduce the coupling between components. Remove as much coupling as you can because having tightly coupled software would just be so not cool. Making some changes to a component will result in cascade of modification to its dependent components. If it is loosely coupled i.e no dependencies managed by that component, then we can contain the changes to that single component.

[1]: {{site.url}}/2015/Coding-to-Interfaces/