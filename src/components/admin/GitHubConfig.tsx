import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { configureGitHubAPI, isGitHubConfiguredViaEnv } from '@/lib/github-api';
import { toast } from '@/hooks/use-toast';
import { Info, Edit, X } from 'lucide-react';

interface GitHubConfigProps {
  onConfigured: (isConfigured: boolean) => void;
}

export default function GitHubConfig({ onConfigured }: GitHubConfigProps) {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if GitHub is configured via environment variables
    const configuredViaEnv = isGitHubConfiguredViaEnv();
    
    if (configuredViaEnv) {
      // If configured via env vars, set as configured
      setIsConfigured(true);
      onConfigured(true);
      
      // Set form values to env vars for display purposes
      setToken(import.meta.env.VITE_GITHUB_TOKEN || '');
      setOwner(import.meta.env.VITE_GITHUB_OWNER || '');
      setRepo(import.meta.env.VITE_GITHUB_REPO || '');
      setBranch(import.meta.env.VITE_GITHUB_BRANCH || 'main');
    } else {
      // Load saved configuration from localStorage if not configured via env
      const savedConfig = localStorage.getItem('github_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setToken(config.token || '');
        setOwner(config.owner || '');
        setRepo(config.repo || '');
        setBranch(config.branch || 'main');
        setIsConfigured(true);
        onConfigured(true);
        
        // Configure the API with saved settings
        configureGitHubAPI({
          token: config.token,
          owner: config.owner,
          repo: config.repo,
          branch: config.branch,
        });
      }
    }
  }, [onConfigured]);

  const handleSaveConfig = () => {
    if (!token || !owner || !repo) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const config = { token, owner, repo, branch };
      
      // Save to localStorage
      localStorage.setItem('github_config', JSON.stringify(config));
      
      // Configure the API
      configureGitHubAPI(config);
      
      setIsConfigured(true);
      onConfigured(true);
      
      toast({
        title: 'Success',
        description: 'GitHub configuration saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save configuration',
        variant: 'destructive',
      });
    }
  };

  const handleClearConfig = () => {
    localStorage.removeItem('github_config');
    setToken('');
    setOwner('');
    setRepo('');
    setBranch('main');
    setIsConfigured(false);
    onConfigured(false);
    
    toast({
      title: 'Success',
      description: 'GitHub configuration cleared',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        {isGitHubConfiguredViaEnv() && (
          <div className="mb-4 p-3 bg-muted rounded-md flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Using Environment Variables</p>
              <p className="text-muted-foreground">
                GitHub configuration is set via environment variables. To change these settings, update your .env file.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">Owner:</span> {import.meta.env.VITE_GITHUB_OWNER}
                </div>
                <div>
                  <span className="font-medium">Repo:</span> {import.meta.env.VITE_GITHUB_REPO}
                </div>
                <div>
                  <span className="font-medium">Branch:</span> {import.meta.env.VITE_GITHUB_BRANCH || 'main'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isConfigured ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Connected to GitHub</p>
                <p className="text-sm text-muted-foreground">
                  {owner}/{repo} ({branch})
                </p>
              </div>
              <div className="space-x-2">
                {!import.meta.env.VITE_GITHUB_TOKEN && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsConfigured(false);
                      onConfigured(false);
                    }}
                  >
                    Edit
                  </Button>
                )}
                {!import.meta.env.VITE_GITHUB_TOKEN && (
                  <Button
                    variant="destructive"
                    onClick={handleClearConfig}
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="token">GitHub Personal Access Token *</Label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Token needs permissions: repo, contents
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner">Repository Owner *</Label>
                <Input
                  id="owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="username or organization"
                  required
                />
              </div>
              <div>
                <Label htmlFor="repo">Repository Name *</Label>
                <Input
                  id="repo"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="repository-name"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveConfig} className="flex-1">
                {isConfigured ? 'Update Configuration' : 'Save Configuration'}
              </Button>
              {isConfigured && (
                <Button variant="outline" onClick={handleClearConfig}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}