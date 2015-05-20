---
layout: post
published: true
title: Perils of Mutability
excerpt: Exposing the state of an object can be dangerous
main: true
---

I was doing a course on coursera called [Programming Languages][1]. Finishing that course was a turning point for me to understand how languages work and acquire the adeptness to learn a new language. I was really interested when the topic mutability was being discussed. Mutability refers to the ability to change the state of an object or a variable. A  lot of (pure) functional languages don't even provide mutability. That means, when you create a variable, then you can't modify the state of the variable. If you say x=1, x should remain 1 no matter what. It sometimes seems a bit too restrictive. But restrictiveness can be helpful sometimes.

Let's say we have a User who is created with an username, password and default roles.

{% highlight java %}
public class User {

    private String userName;

    private String passWord;

    private String[] roles;

    public User(String userName, String passWord) {
        this.userName = userName;
        this.passWord = passWord;
        this.roles = new String[]{"ROLE1", "ROLE2"};
    }

    public String[] getRoles() {
        return roles;
    }

    public boolean isAdmin(){
        for (String role : roles) {
            if(role.contains("ADMIN"))
                return true;
        }
        return false;
    }

}
{% endhighlight %}

So when ever we would want to check if the user is admin, then isAdmin() is called. The isAdmin() checks all the roles it has and decides to return true if it has some role called ADMIN.

{% highlight java %}
public class Main {
    public static void main(String[] args) {

        User someUser = new User("foo", "bar");
        String[] roles = someUser.getRoles();

        for (String role : roles) {
            System.out.println(role);
        }

        System.out.println("is someUser an Admin?  " + someUser.isAdmin());
    }
}
{% endhighlight %}

```
Output:
ROLE1
ROLE2
is someUser an Admin? false
```

This seems like a really simple and harmless usage of User but when you do someUser.getRoles(), the reference to the string array in the someUser is returned. And with reference you can modify the values pointed by the reference.

{% highlight java %}
public class Main {
    public static void main(String[] args) {

        User someUser = new User("foo", "bar");
        String[] roles = someUser.getRoles();

        System.out.println("Roles: ");
        for (String role : roles) {
            System.out.println(role);
        }
        System.out.println("is someUser an Admin?  " + someUser.isAdmin());

        roles[1] = "ADMIN";
        System.out.println("Roles: ");
        for (String role : roles) {
            System.out.println(role);
        }
        System.out.println("is someUser an Admin?  " + someUser.isAdmin());
    }
}
{% endhighlight %}

```
Output:
Roles:
ROLE1
ROLE2
is someUser an Admin? false
Roles:
ROLE1
ADMIN
is someUser an Admin? true
```

This is something the creator of the User class wouldn't have intended but due to mutability, we are able to change the state of an object, thus changing the behavior of User.

So how can we prevent it? Either the language itself should not provide mutability. But all the languages don't. So instead of returning the reference of the state(role array) we can return a copy of its state. When we provide a copy, nobody can change the actual state(role array) of the user.

{% highlight java %}
    public String[] getRoles() {
        return Arrays.copyOf(roles, roles.length);
    }
{% endhighlight %}

```
Output:
Roles:
ROLE1
ROLE2
is someUser an Admin? false
Roles:
ROLE1
ADMIN
is someUser an Admin? false
```

Changing the copy of the roles in main does not change the actual roles in the someUser object as we are returning the copy of the roles. Small things like this could potentially inflict so much damage unless the developer is aware of the consequences of exposing the state. It is also a good OOP practise by not exposing the state of an object to the outside world.

More Thoughts:

Whenever you expose an object's reference, anyone can make changes to the state. Consider you have a collection and when you expose it to the outside, then anyone can manipulate it like say remove all the items or add new things.

PS:
I would recommend you to take this course [Programming Languages][1]. Reason : It will blow your mind

[1]: https://www.coursera.org/course/proglang