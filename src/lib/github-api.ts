import { Product } from '@/data/products';

// GitHub API configuration
const GITHUB_API_URL = 'https://api.github.com';
let GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
let GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || '';
let GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || '';
let GITHUB_BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main';

// Check if GitHub is configured via environment variables
export const isGitHubConfiguredViaEnv = (): boolean => {
  return !!import.meta.env.VITE_GITHUB_TOKEN && 
         !!import.meta.env.VITE_GITHUB_OWNER && 
         !!import.meta.env.VITE_GITHUB_REPO;
};

/**
 * Configure the GitHub API settings
 * Only updates values if environment variables are not set
 */
export const configureGitHubAPI = (config: {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
}) => {
  // Only set values from config if environment variables are not present
  if (!import.meta.env.VITE_GITHUB_TOKEN) GITHUB_TOKEN = config.token;
  if (!import.meta.env.VITE_GITHUB_OWNER) GITHUB_OWNER = config.owner;
  if (!import.meta.env.VITE_GITHUB_REPO) GITHUB_REPO = config.repo;
  if (config.branch && !import.meta.env.VITE_GITHUB_BRANCH) GITHUB_BRANCH = config.branch;
};

/**
 * Get the base64 encoded content of a file from GitHub
 */
export const getFileContent = async (path: string): Promise<{ content: string; sha: string }> => {
  if (!GITHUB_TOKEN) throw new Error('GitHub token not configured');

  const response = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: atob(data.content),
    sha: data.sha,
  };
};

/**
 * Update a file in GitHub repository
 */
export const updateFile = async (path: string, content: string, message: string, sha: string): Promise<void> => {
  if (!GITHUB_TOKEN) throw new Error('GitHub token not configured');

  const response = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: btoa(content),
        sha,
        branch: GITHUB_BRANCH,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update file: ${response.statusText}`);
  }
};

/**
 * Upload an image to GitHub repository
 */
export const uploadImage = async (path: string, base64Image: string, message: string): Promise<string> => {
  if (!GITHUB_TOKEN) throw new Error('GitHub token not configured');

  // Remove data URL prefix if present
  const base64Content = base64Image.includes('base64,')
    ? base64Image.split('base64,')[1]
    : base64Image;

  const response = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: base64Content,
        branch: GITHUB_BRANCH,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content.download_url;
};

/**
 * Get products data from GitHub
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { content } = await getFileContent('src/data/products.json');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Save products data to GitHub
 */
export const saveProducts = async (products: Product[]): Promise<void> => {
  try {
    const { sha } = await getFileContent('src/data/products.json');
    await updateFile(
      'src/data/products.json',
      JSON.stringify(products, null, 2),
      'Update products data',
      sha
    );
  } catch (error) {
    console.error('Error saving products:', error);
    throw error;
  }
};

/**
 * Upload a product image to GitHub
 */
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64data = reader.result as string;
        const timestamp = new Date().getTime();
        const path = `public/Jersey-Pics/${productId}-${timestamp}-${file.name}`;
        const imageUrl = await uploadImage(path, base64data, `Upload product image: ${file.name}`);
        resolve(imageUrl);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};