// api.ts
// One place for every call from React to the PHP API.
// Everyone uses apiGet / apiPost instead of calling fetch directly,
// so nobody forgets credentials: 'include' (needed for the login session).

// Folder name inside htdocs (Windows: C:\xampp\htdocs, Mac: /Applications/XAMPP/htdocs)
export const API_URL = 'http://localhost/2ASSESSMENT-ADVANCEDWEB/api';

// Folder with the album cover images (cover_image from albums.php is only the file name)
export const IMAGES_URL = 'http://localhost/2ASSESSMENT-ADVANCEDWEB/assets/images/albums';

// Same shape that sendJson() and sendError() return in PHP
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// GET request. Example: const genres = await apiGet<Genre[]>('genres.php');
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}/${path}`, {
    credentials: 'include', // send the session cookie to PHP
  });
  return readAnswer<T>(response);
}

// POST request with a JSON body. Example: await apiPost('login.php', { email, password });
export async function apiPost<T>(path: string, body: object = {}): Promise<T> {
  const response = await fetch(`${API_URL}/${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return readAnswer<T>(response);
}

// Turns the PHP answer into data, or throws an Error with the PHP message.
// The page catches it and shows the message to the user.
async function readAnswer<T>(response: Response): Promise<T> {
  let result: ApiResponse<T>;
  try {
    result = await response.json();
  } catch {
    // PHP sent something that is not JSON (Apache down, wrong path)
    throw new Error('Could not reach the server.');
  }

  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
