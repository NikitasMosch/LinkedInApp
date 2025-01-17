import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule (for NgFor... usage on the HTML)
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../../services/user-service/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule


@Component({
  selector: 'app-my-contacts-posts',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './my-contacts-posts.component.html',
  styleUrl: './my-contacts-posts.component.css'
})
export class MyContactsPostsComponent implements OnInit {
  articles: any[] = []; // Store articles of the user
  newComments: { [key: number]: string } = {}; // Store comment text for each article (based on key: articleId)
  currentUser: any = {}; // Store the current user information

  token: string | null = null; // Store token from localStorage

  constructor(private userService: UserService, private router: Router) {} // Inject the UserService

  ngOnInit(): void {
    // Fetch the token from localStorage
    this.token = localStorage.getItem('token');

    // Check if token is available
    if (this.token) {
      this.userService.getUserProfileFromToken(this.token).subscribe(
        (user) => {
          this.currentUser = user;
        },
        (error) => {
          console.error('Error fetching current user', error);
        }
      );
      // Fetch contact articles using the token
      this.userService.getContactArticles(this.token).subscribe(
        (data) => {
          this.articles = data;
          this.articles.forEach(article => {
            this.loadArticlePhoto(article);
          });
        },
        (error) => {
          console.error('Error fetching contact articles', error);
        }
      );
    } else {
      // If no token found, redirect to login page
      this.router.navigate(['../../login-page']);
    }
  }
  
  loadArticlePhoto(article: any): void {
    if (this.token) {
      if (article.photoUrl) {
        this.userService.downloadArticlePhoto(this.token, article.articleID).subscribe(
          (blob) => {
            // Convert the image to base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              article.photoUrl = reader.result as string;
            };
          },
          (error) => {
            console.error('Error fetching article photo', error);
          }
        );
      }
    }
  }

  likeArticle(articleId: number): void {
    // Fetch the token from localStorage
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.userService.likeArticle(this.token, articleId).subscribe(
        (response: boolean) => {
          if (response) {
            console.log('Article liked successfully');

            this.ngOnInit(); // Refresh the articles after liking an article

          } else {
            console.log('Unliked article');
            
            // Do the local refresh of the updated article
            this.ngOnInit(); // Refresh the articles after liking an article
          }
        },
        (error) => {
          console.error('Error liking article', error);
        }
      );
    } else {
      // If no token found, redirect to login page
      this.router.navigate(['../../login-page']);
    }
  }


  addComment(articleId: number): void {
    // Fetch the token from localStorage
    this.token = localStorage.getItem('token');

    const commentText = this.newComments[articleId];
    const newComment = { 
      content: commentText
    };
    
    if (this.token) {
      this.userService.createComment(this.token, newComment, articleId).subscribe(
        (response: boolean) => {
          if (this.token && response) {
            console.log('Comment added successfully');

            this.ngOnInit(); // Refresh the articles after adding a comment
            this.newComments[articleId] = ''; // Clear the input field after adding the comment

          } else {
            console.error('Failed to add comment');
          }
        },
        (error) => {
          console.error('Error adding comment', error);
        }
      );
    }
  }

  deleteComment(articleId: number, commentId: number): void {
    if (this.token) {
      this.userService.deleteComment(this.token, commentId).subscribe(
        (response) => {
            console.log('Comment deleted successfully');
            // Refresh the page after deleting the comment
            this.ngOnInit();
        },
        (error) => {
          console.error('Error deleting comment', error);
        }
      );
    }
  }

}
