import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './MyProfile.css';
import useAuth from '../../custom-hooks/useAuth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { communityImages } from "../importImages/ImportImages"; // Import the community images
import communitiesData from '../../data/communities.json'; // Import communities data from your static JSON

const MyProfile = () => {
  const { currentUser } = useAuth();
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!currentUser) {
        console.log('No user is logged in');
        return;
      }

      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', currentUser.uid); // Fetching the user from Firestore
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          // Get the joined communities from the user data
          const communitiesList = userData.joinedCommunities || [];

          // Map the collection names to the community details from communitiesData
          const communitiesWithDetails = communitiesList.map((collectionName) => {
            let foundCommunity = null;

            // Loop through categories and subcategories in communitiesData
            for (const category in communitiesData) {
              for (const subCategory in communitiesData[category]) {
                const community = communitiesData[category][subCategory].find(
                  (item) => item.collectionName === collectionName
                );
                if (community) {
                  foundCommunity = community;
                  break;
                }
              }
              if (foundCommunity) break;
            }

            if (foundCommunity) {
              // Add the image based on collectionName using the communityImages
              const communityImage = communityImages[collectionName] || 'https://via.placeholder.com/150';
              return {
                id: collectionName, // Using collectionName as the ID
                name: foundCommunity.name,
                description: foundCommunity.description,
                image: communityImage,
              };
            }
            return null; // If no data is found for the community
          }).filter(Boolean); // Remove null values

          setJoinedCommunities(communitiesWithDetails);
        } else {
          console.log('No user data found!');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserCommunities();
  }, [currentUser]);

  const handleCommunityClick = (communityId) => {
    navigate(`/community/${communityId}`); // Navigate to the community page with the collectionName
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-info">
        <div className="user-info">
          <h3>{currentUser?.displayName}</h3>
        </div>
      </div>

      <div className="joined-communities">
        <h3>Joined Communities</h3>
        <div className="community-list">
          {joinedCommunities.length > 0 ? (
            joinedCommunities.map((community) => (
              <div
                key={community.id}
                className="community-item"
                onClick={() => handleCommunityClick(community.id)} // Add onClick handler
              >
                <img
                  src={community.image}
                  alt={community.name}
                  className="community-image"
                />
                <div className="community-details">
                  <h4>{community.name}</h4>
                  <p>{community.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No communities joined yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
