---
layout: post
published: true
title: Coding to Interfaces
excerpt: Don't depend on a Concrete types, Depend on an Interface
main: true
---

Let's say you are writing a piece of software which generates awesome things with call of a method. But for that you need to fetch some data and process it. For now let's read a file and get the data.

{% highlight java %}
public class AwesomenessGenerator {

    public String readAndProcessData(){
        //some logic
        FileReader fileReader = new FileReader();
        String data = fileReader.read(); //read has all the logic to get data
        //logic to process the data
    }
}

{% endhighlight %}
The generator takes in a fileReader and we do some computation and logic with the data.

{% highlight java %}
public class FileReader {
    public String read() {
        String data = null;
        //All The logic of fetching from file goes here
        return data;
    }
}
{% endhighlight %}

The fileReader is responsible to take care of itself to read from a file. (Let's not complicate things by sending which file to read from at least for now!)

{% highlight java %}
public static void main(String[] args) {
        AwesomenessGenerator awesomenessGenerator = new AwesomenessGenerator();
        String result = awesomenessGenerator.readAndProcessData();
        System.out.println(result);
}
{% endhighlight %}
Your software works like a charm, it generates awesomeness whenever you want it. You are happy that everything works.

After some days, you feel like reading from a file is so yesterday. You want to read from a database. So now you have to change your code. Let's see how we usually go about doing that. We would then create and use a DatabaseReader in our AwesomenessGenerator.

{% highlight java %}
public class AwesomenessGenerator {

    public String readAndProcessData(){
        //some logic
        DatabaseReader databaseReader = new DatabaseReader();
        String data = databaseReader.read(); //read has all the logic to get data
        //some other logic
    }
}
{% endhighlight %}

I had to do the change in the generator. That is not the right way to do it because, what if you had all the tests that used fileReader and now since we have changed it we have to change the test as well. And what if tomororw we need to read from a cloud or something we need to make the change to use a CloudReader or something. So how can we bring a change to a system without affecting it's already placed logic. We should be able to swap the reader without changing the generator's code.

Polymorphism to the rescue!

Let's create an interface called a Reader(not the java.io.Reader but our own)

{% highlight java %}
public interface Reader {
    public String read();
}
{% endhighlight %}

Let's inherit all our concrete readers ( FileReader, DatabaseReader, CloudReader, SomeThingFromFutureReader), so every reader needs to have a read() implemented.

{% highlight java %}
public class FileReader implements Reader{
    public String read() {
        String data = null;
        //All The logic of fetching from file goes here
        return data;
    }
}
{% endhighlight %}


{% highlight java %}
public class DatabaseReader implements Reader {
    public String read() {
        String data= null;
        //some logic to connect to the db and get some data
        return data;
    }
}
{% endhighlight %}

And inorder for the generator to use a reader we just pass in the interface Reader and not the concrete Reader.

{% highlight java %}
public static void main(String[] args) {
        Reader reader = new DatabaseReader();
        AwesomenessGenerator awesomenessGenerator = new AwesomenessGenerator();
        String result = awesomenessGenerator.readAndProcessData(reader);
        System.out.println(result);
}
{% endhighlight %}


{% highlight java %}
public class AwesomenessGenerator {

    public String readAndProcessData(Reader reader){
        //some logic
        String data = reader.read(); //read has all the logic to get data
        //some other logic
    }
}
{% endhighlight %}

we can safetly call the read() on the interface. And depending on the concrete implementation that has been in the reference of the interface, that particular read operation would be called. So in the new generator code we pass in DatabaseReader to readAndProcessData() and DatabaseReader's read() would be called inside readAndProcessData(). And if we pass in a FileReader, that particular read() would be called. So we have made the readers switchable. As long as any readers implement the Reader then it can be switched. It is assumed that the concrete reader's read() would take care of the logic on how it is going to read. In the end the generator just needs the data, it doesn't care how it was fetched from.

{% highlight java %}
public static void main(String[] args) {
        Reader reader = new FileReader();
        AwesomenessGenerator awesomenessGenerator = new AwesomenessGenerator();
        String result = awesomenessGenerator.readAndProcessData(reader);
        System.out.println(result);
}
{% endhighlight %}

In the above code we just swapped DatabaseReader to FileReader without changing a single line of our Generator. Now the Generator can possibly read from a reader that doesn't even exist. All the new reader has to do is to implement the Reader interface. We would just have to write test for that particular newly added reader and not to the already tested and working Generator. The tests for the Generator should have used a mocked Reader. 

There is a way to plug in different readers without even having to change the main(). For now we instantiate the Reader with a concrete Reader and pass it to the readAndProcessData(). For that we have to change the java code and re compile and re deploy. If we don't even want to change it then there is something called Dependency Injection(More on it later). For now we just wrote our generator which takes in an interface rather than a concrete class making it easy for us to switch between any implementation of that interface.

Fun fact: Strategy Pattern also works using polymorphism.