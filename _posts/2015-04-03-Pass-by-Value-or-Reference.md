---
layout: post
published: true
title: Pass by Value or Reference
excerpt: Are Java's method arguments pass by value of pass by reference?
main: true
---

Hello awesome people! When you are writing functions to modularize your code(if you are not, then it might be a code smell), you should know how the arguments are passed to the function and how they are stored. Let's take a simple example. We have a function which takes in an int and increments it in the function.

{% highlight java %}
public class Functions {
    public static void main(String[] args) {
        int a = 10;
        System.out.println("Before increment: " + a);
        increment(a);
        System.out.println("After increment: " + a);
    }
    private static void increment(int number) {
        number++;
    }
}
{% endhighlight %}

Think about what the output would be in your mind. (In Java arguments are always sent as value)

```
OUTPUT:
Before increment: 10
After increment: 10
```

When increment is called, the state of the program would be something like this.
Actual Argument = a
Formal Parameter = number
Since it is a pass by value a's value is copied to number. And when ever we change the number, we are just changing the value of the number. When increment returns the stack frame(of increment) is destroyed and then we see no change in a.

Let's write some more functions. I have a student class with name and age with public modifier just so that I can access it easily outside( I can use setter also but just for simplicity)

{% highlight java %}
public class Student {
    public String name;
    public int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
{% endhighlight %}
And I have created a function called changeStudent which changes the name and age of the student that was passed into it.

{% highlight java %}
public class Functions {

    public static void main(String[] args) {

        Student student = new Student("vishnu", 21);
        System.out.println("Before changeStudent: " + student);
        changeStudent(student);
        System.out.println("After changeStudent: " + student);

    }

    private static void changeStudent(Student anotherStudent) {
        anotherStudent.name = "karthik";
        anotherStudent.age = 100;
    }

}
{% endhighlight %}

Can you predict the output when you run main. Think about it.

```
OUTPUT:
Before changeStudent: Student{name='vishnu', age=21}
After changeStudent: Student{name='karthik', age=100}
```

What sorcery is this!! Just now we saw that Java sent the arguments as pass by value. And any change to the copy of the value should not affect the actual argument. True. What exactly happened when we passed in student was, the reference pointed to the student was passed by value(copied to anotherStudent). Say what? Is it Value or Reference!!!

To clearly explain what a reference is, imagine references are like remote controls. When ever we create a new object and assign it to the reference, we can interact with the object through the dot operator. So when we created student we created a remote control also and when we did a new Student(), we created something that the remote can point to. And we can interact with it by changing the properties like student.name = "blah".

So when we called the function, student remote(reference as a value) was copied as anotherStudent. The actual remote was not given to the function, but it's copy was. They both are now pointing to the same Student object. So what ever change we did using the anotherStudent in the function is reflected in the Student object. When the function returns the stack frame gets destroyed along with the anotherStudent remote(reference) since function variables and parameters are stored in the stack.

Now let's modify the function.

{% highlight java %}
public class Functions {

    public static void main(String[] args) {

        Student student = new Student("vishnu", 21);
        System.out.println("Before changeStudent: " + student);
        changeStudent(student);
        System.out.println("After changeStudent: " + student);

    }

    private static void changeStudent(Student anotherStudent) {
        anotherStudent = new Student("karthik", 100);
    }

}
{% endhighlight %}

Let's try to predict what the output would be.

```
OUTPUT:
Before changeStudent: Student{name='vishnu', age=21}
After changeStudent: Student{name='vishnu', age=21}
```

Strange or is it! You said the reference is passed and we can change the value pointed by the reference. True! But I didn't say we can change the reference itself. This is where the subtle difference is.

When we passed in student, the reference(remote) was copied to the anotherStudent reference(remote). We changed what was pointed by anotherStudent by a newly created Student. But this did not change the student reference which was pointing to the old student object in the main(). So now both the reference are pointing to two different student objects. And when the function returns anotherStudent reference is destroyed along with the stack frame but not the new student that was created inside changeStudent(). This is because all the objects that are created are placed in the heap and not in the stack. So it will be there till the garbage collector kicks in.

Let's have a quick programming trial. Let's try to write a swap function which swaps two students that are passed in. Please try it out.

{% highlight java %}
  public static void main(String[] args) {

        Student shruthi = new Student("shruthi", 18);
        Student hari = new Student("hari", 21);
        System.out.println("Before Swap: " + shruthi + " " + hari);
        swap(shruthi, hari);
        System.out.println("After Swap: " + shruthi + " " + hari);

    }

    private static void swap(Student thisStudent, Student thatStudent) {
        Student temp;
        temp = thisStudent;
        thisStudent = thatStudent;
        thatStudent = temp;
    }
{% endhighlight %}

```
OUTPUT:
Before Swap: Student{name='shruthi', age=18} Student{name='hari', age=21}
After Swap: Student{name='shruthi', age=18} Student{name='hari', age=21}
```

Well that was a fail! What exactly happened was shruthi's reference and hari's reference(as a value) was passed to thisStudent and thatStudent respectively. When we said `temp = thisStudent`, the reference temp is now pointing to the same object as that was pointed by thisStudent. So now shruthi, thisStudent and temp are all pointing to shruthi object. When we said thisStudent = thatStudent. We are changing what was pointed by thisStudent to what is being pointed by thatStudent(who is pointing to hari object). So now thisStudent is pointing to hari. This did not change any of the other references (shruthi and temp are still pointing to shruthi object).
When we said thatStudent = temp, we are making thatStudent point to the same thing temp is pointing(to shruthi object). All these making references point to different objects didn't even alter what shruthi and hari references were pointing at. So when we return from the function we see that they are still pointing to the same objects.

So how can we then actually change the reference. We'll we can't in java at least. If it was C or C++ where you have those funky pointers, you can pass a object reference's address so that you can change the reference itself.
If it was C, swap could have been written like this

{% highlight c %}
 int main(int argv,char* argv[]) {

        Student * shruthi = new Student("shruthi", 18);
        Student * hari = new Student("hari", 21);
        cout<<"Before Swap: " << shruthi << " " << hari);
        swap(&shruthi, &hari);
        cout<<"After Swap: " << shruthi << " " << hari);

    }

    void swap(Student ** thisStudent, Student ** thatStudent) {
        Student * temp;
        *temp = *thisStudent;
        *thisStudent = *thatStudent;
        *thatStudent = *temp;
    }

{% endhighlight %}

So that is all folks. Sometimes these function calls can get tricky always keep in mind the language specs and code accordingly. I always feel that mutating the actual references in a function call is not very evident to the consumers of the method call. So be wary of mutation when writing API methods. 