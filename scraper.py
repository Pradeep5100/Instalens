import sys
import json
import instaloader
import os

def scrape_profile(username: str) -> dict:
    L = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        quiet=True,
    )

    # Use session ID if provided in environment
    session_id = os.getenv("INSTALOADER_SESSION_ID")
    if session_id:
        try:
            # We don't have a full session file, so we manually inject the cookie
            L.context._session.cookies.set("sessionid", session_id, domain=".instagram.com")
            # Set a generic user agent to avoid some blocks
            L.context._session.headers.update({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            })
        except Exception as e:
            # Continue without session if injection fails
            pass

    try:
        profile = instaloader.Profile.from_username(L.context, username)
        return {
            "username": profile.username,
            "fullName": profile.full_name or "",
            "followers": profile.followers,
            "following": profile.followees,
            "posts": profile.mediacount,
            "bio": profile.biography or "",
            "profilePic": profile.profile_pic_url or "",
            "isBusinessAccount": profile.is_business_account,
            "businessCategoryName": profile.business_category_name or "Digital Creator",
            "dataSource": "instaloader",
        }
    except instaloader.exceptions.ProfileNotExistsException:
        return {"error": f"Profile '{username}' does not exist."}
    except instaloader.exceptions.ConnectionException as e:
        return {"error": f"Connection error: {str(e)}"}
    except instaloader.exceptions.LoginRequiredException:
        return {"error": "Login required to access this profile. Please provide a valid INSTALOADER_SESSION_ID."}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No username provided."}))
        sys.exit(1)

    username = sys.argv[1].strip().lstrip("@")
    result = scrape_profile(username)
    print(json.dumps(result))
