package com.Backend_v10.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Backend_v10.User.User;
import com.Backend_v10.User.UserRepository;
import com.Backend_v10.UserConnection.UserConnectionRepository;
import com.Backend_v10.Jobs.Job;
import com.Backend_v10.JobApplication.JobApplication;
import com.Backend_v10.Articles.Article;
import com.Backend_v10.Comments.Comment;

import com.Backend_v10.Comments.CommentRepository;
import com.Backend_v10.Articles.ArticleRepository;
import com.Backend_v10.JobApplication.JobApplicationRepository;
import com.Backend_v10.Jobs.JobRepository;

// To encapsulate the method calls + repository saves
@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private ArticleRepository articleRepo;

    @Autowired
    private JobApplicationRepository jobApplicationRepo;

    @Autowired
    private JobRepository jobRepo;

    @Autowired
    private UserConnectionRepository ConnRepo;

    @Transactional
    public void addArticle(User user, Article newArticle) {
        User userlocal = userRepo.findByEmail(user.getEmail()).get();
        userlocal.addArticle(newArticle);
        userRepo.save(userlocal);
    }

    @Transactional
    public void addComment(Article article, User user, Comment newComment) {
        Article articlelocal = articleRepo.findById(article.getArticleID()).get();
        User userlocal = userRepo.findByEmail(user.getEmail()).get();
        articlelocal.addComment(newComment);
        userlocal.addComment(newComment);
        
        commentRepo.save(newComment);   //save the comment first to avoid duplication
        articleRepo.save(articlelocal);
        userRepo.save(userlocal);
    }

    @Transactional
    public void addJob(User user, Job newJob) {
        User userlocal = userRepo.findByEmail(user.getEmail()).get();
        userlocal.addJob(newJob);
        userRepo.save(userlocal);
    }

    @Transactional
    public void addJobApplication(Job job, User user, JobApplication newJobApplication) {
        Job joblocal = jobRepo.findById(job.getJobID()).get();
        User userlocal = userRepo.findByEmail(user.getEmail()).get();
        joblocal.addJobApplication(newJobApplication);
        userlocal.addJobApplication(newJobApplication);

        jobApplicationRepo.save(newJobApplication);   //save the job application first to avoid duplication
        jobRepo.save(joblocal);
        userRepo.save(userlocal);
    }

    @Transactional
    public void addContact(User user1, User user2) {
        User userlocal1 = userRepo.findByEmail(user1.getEmail()).get();
        User userlocal2 = userRepo.findByEmail(user2.getEmail()).get();
        userlocal1.addContact(userlocal2);
        userRepo.save(userlocal1);
        userRepo.save(userlocal2);
    }

    @Transactional
    public List<Article> return_articles_of_contacts(String email){
        Optional<User> user = userRepo.findByEmail(email);
        List<Long> articles_of_contactsids = userRepo.findContactArticles(user.get().getUserID());
        List<Article> articles_of_contacts = new ArrayList<>();
        for(int i = 0; i < articles_of_contactsids.size(); i++){
            articles_of_contacts.add(articleRepo.findById(articles_of_contactsids.get(i)).get());
        }
        System.out.println(articles_of_contacts);
        return articles_of_contacts;
    }
    
    //Find What Kind of Connection relates 2 Users
    @Transactional
    public String Identify_Connection(String Myemail,String Useremail){
        //Check if User is a Contact
        Optional<User> Me = this.userRepo.findByEmail(Myemail);
        List<User> myContacts = Me.get().getMyContacts();
        for(User u: myContacts){
            if( u.getEmail().equals(Useremail) == true){
                    //User is Contact
                    return "Connected";
                }
            }
        //return "here?????";

        //Check if We Have sent a Request to User
        if(this.ConnRepo.CheckIfRequestExists(Myemail, Useremail) == 1L){
            return "Request Sent";
        }
        //Check if We Have Received a Request from User
        else if(this.ConnRepo.CheckIfRequestExists(Useremail, Myemail) == 1L)
            return "Got Request";
        else
            return "Sent Request";
        
    }

}