
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Facebook, ImageIcon, Sparkles, Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface FacebookPost {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  imagePrompt: string;
}

const Index = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<FacebookPost | null>(null);
  const [apiKey, setApiKey] = useState("");

  const csTopics = [
    "Machine Learning",
    "Web Development",
    "Data Structures",
    "Algorithms",
    "Cybersecurity",
    "Cloud Computing",
    "Mobile Development",
    "DevOps",
    "Artificial Intelligence",
    "Blockchain"
  ];

  const generateContent = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first!");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("Please enter your OpenAI API key!");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate text content
      const contentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a social media content creator specializing in Computer Science topics. Create engaging Facebook posts that are educational yet accessible.'
            },
            {
              role: 'user',
              content: `Create a Facebook post about "${topic}" in Computer Science. Return a JSON object with:
              - title: A catchy, engaging title (max 60 characters)
              - description: An informative but engaging description (max 300 characters)
              - tags: Array of 5-8 relevant hashtags (without # symbol)
              - imagePrompt: A detailed prompt for generating an illustration about this topic`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      if (!contentResponse.ok) {
        throw new Error('Failed to generate content');
      }

      const contentData = await contentResponse.json();
      const content = JSON.parse(contentData.choices[0].message.content);

      // Generate image using OpenAI DALL-E
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `${content.imagePrompt}. Professional, clean, modern illustration suitable for social media. Tech/CS theme.`,
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        }),
      });

      if (!imageResponse.ok) {
        throw new Error('Failed to generate image');
      }

      const imageData = await imageResponse.json();

      setGeneratedPost({
        title: content.title,
        description: content.description,
        tags: content.tags,
        imageUrl: imageData.data[0].url,
        imagePrompt: content.imagePrompt
      });

      toast.success("Facebook post generated successfully!");
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error("Failed to generate content. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadImage = async () => {
    if (!generatedPost?.imageUrl) return;
    
    try {
      const response = await fetch(generatedPost.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedPost.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Facebook className="h-10 w-10 text-blue-600" />
            <Sparkles className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Facebook Post Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create engaging Computer Science posts with AI-generated content and images
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Generate Your Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>

              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="topic">CS Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Machine Learning fundamentals"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* Quick Topics */}
              <div className="space-y-2">
                <Label>Quick Topics</Label>
                <div className="flex flex-wrap gap-2">
                  {csTopics.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setTopic(t)}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateContent}
                disabled={isGenerating || !topic.trim() || !apiKey.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Facebook Post
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                Post Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedPost ? (
                <div className="space-y-4">
                  {/* Facebook Post Mockup */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">CS</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">CS Insights</p>
                          <p className="text-xs text-gray-500">Just now • 🌍</p>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-gray-900">
                        {generatedPost.title}
                      </h3>
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {generatedPost.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {generatedPost.tags.map((tag, index) => (
                          <span key={index} className="text-blue-600 text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Post Image */}
                    <div className="relative">
                      <img
                        src={generatedPost.imageUrl}
                        alt={generatedPost.title}
                        className="w-full h-64 object-cover"
                      />
                      <Button
                        onClick={downloadImage}
                        size="sm"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Post Actions */}
                    <div className="p-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>👍 💡 ❤️ 42 reactions</span>
                        <span>8 comments • 15 shares</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Copy Actions */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => copyToClipboard(`${generatedPost.title}\n\n${generatedPost.description}\n\n${generatedPost.tags.map(tag => `#${tag}`).join(' ')}`)}
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Full Post Text
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => copyToClipboard(generatedPost.title)}
                        variant="outline"
                        size="sm"
                      >
                        Copy Title
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(generatedPost.tags.map(tag => `#${tag}`).join(' '))}
                        variant="outline"
                        size="sm"
                      >
                        Copy Tags
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Facebook className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">No post generated yet</p>
                  <p>Enter a topic and click generate to create your Facebook post</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>🚀 Generate engaging CS content with AI • Built with React & OpenAI</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
