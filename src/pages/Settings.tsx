import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface UserDetails {
  name: string;
  age: number;
  education: string;
  dream: string;
}

const Settings = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const navigate = useNavigate();
  const { userId, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/user/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setUserDetails(data.data);
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to fetch user details",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching user details",
          variant: "destructive",
        });
      }
    };

    fetchUserDetails();
  }, [userId, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-4xl bg-gray-800 border-neon-cyan">
        <CardHeader>
          <CardTitle className="text-4xl text-white">Profile Settings</CardTitle>
          <CardDescription className="text-xl text-gray-300">
            View and manage your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {userDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-700 rounded-lg">
                <h3 className="text-2xl font-medium text-white mb-2">Name</h3>
                <p className="text-xl text-gray-300">{userDetails.name}</p>
              </div>
              <div className="p-6 bg-gray-700 rounded-lg">
                <h3 className="text-2xl font-medium text-white mb-2">Age</h3>
                <p className="text-xl text-gray-300">{userDetails.age}</p>
              </div>
              <div className="p-6 bg-gray-700 rounded-lg">
                <h3 className="text-2xl font-medium text-white mb-2">Education</h3>
                <p className="text-xl text-gray-300">{userDetails.education}</p>
              </div>
              <div className="p-6 bg-gray-700 rounded-lg">
                <h3 className="text-2xl font-medium text-white mb-2">Dream Career</h3>
                <p className="text-xl text-gray-300">{userDetails.dream}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              variant="destructive"
              className="h-12 text-lg bg-red-600 hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings; 