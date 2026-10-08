// Obsidian console edition: a compact C++17 companion for the browser project.
#include <algorithm>
#include <iostream>
#include <iterator>
#include <map>
#include <queue>
#include <set>
#include <stack>
#include <string>
#include <vector>

struct Song { std::string id, title, artist; };

class Playlist {
    struct Node {
        Song song; Node* prev; Node* next;
        // Initialize empty links so the list can safely connect this song.
        explicit Node(Song s):song(std::move(s)),prev(nullptr),next(nullptr){}
    };
    Node* head_ = nullptr; Node* tail_ = nullptr; Node* current_ = nullptr;
public:
    // Release every owned node so the hand-built linked list does not leak.
    ~Playlist(){ while(head_){Node* next=head_->next;delete head_;head_=next;} }
    // Append songs so the list preserves the playlist's visible order.
    void add(const Song& song){Node* n=new Node(song);if(!head_)head_=tail_=n;else{n->prev=tail_;tail_->next=n;tail_=n;}if(!current_)current_=n;}
    // Find a song by its stable id for playback and playlist operations.
    Node* find(const std::string& id) const {for(Node* n=head_;n;n=n->next)if(n->song.id==id)return n;return nullptr;}
    // Remove an id while reconnecting both links around its node.
    bool remove(const std::string& id){Node* n=find(id);if(!n)return false;if(n->prev)n->prev->next=n->next;else head_=n->next;if(n->next)n->next->prev=n->prev;else tail_=n->prev;if(current_==n)current_=n->next?n->next:n->prev;delete n;return true;}
    // Advance or rewind and wrap at either end of the active play order.
    const Song* step(bool forward){if(!current_)return nullptr;current_=forward?(current_->next?current_->next:head_):(current_->prev?current_->prev:tail_);return &current_->song;}
    // Print the linked list from the head for the console menu.
    void show() const {int i=1;for(Node* n=head_;n;n=n->next)std::cout<<i++<<". "<<n->song.artist<<" — "<<n->song.title<<"\n";if(!head_)std::cout<<"(empty)\n";}
};

// KMP searches a song field in linear time after building a prefix table.
bool kmp(const std::string& text,const std::string& pattern){if(pattern.empty())return true;std::vector<std::size_t> lps(pattern.size());for(std::size_t i=1,len=0;i<pattern.size();){if(pattern[i]==pattern[len])lps[i++]=++len;else if(len)len=lps[len-1];else lps[i++]=0;}for(std::size_t i=0,j=0;i<text.size();){if(text[i]==pattern[j]){++i;++j;if(j==pattern.size())return true;}else if(j)j=lps[j-1];else ++i;}return false;}

int main(){
    std::map<std::string,Song> library{{"s1",{"s1","Sunroom","Mira Sol"}},{"s2",{"s2","Blue Hour","Northbound"}},{"s3",{"s3","Soft Focus","Mira Sol"}}};
    Playlist playlist;for(const auto& item:library)playlist.add(item.second);
    std::stack<Song> history;std::queue<Song> upNext;std::set<std::string> mine{"s1","s2"},friendSongs{"s2","s3"};
    std::vector<std::vector<std::string>> cardGrid{{"Home","Explore"},{"Liked","Playlists"}};
    bool running=true;while(running){std::cout<<"\nObsidian Playlist Manager\n1 Show songs\n2 Search (KMP)\n3 Play next queued song\n4 Queue song by id\n5 Previous\n6 Blend profiles\n7 Show 2D menu grid\n0 Exit\nChoice: ";int choice=0;if(!(std::cin>>choice))break;std::string id;
        switch(choice){case 1:playlist.show();break;case 2:{std::string query;std::cout<<"Search: ";std::cin.ignore();std::getline(std::cin,query);for(const auto& item:library)if(kmp(item.second.title,query)||kmp(item.second.artist,query))std::cout<<item.second.artist<<" — "<<item.second.title<<"\n";break;}case 3:if(!upNext.empty()){history.push(upNext.front());std::cout<<"Playing "<<upNext.front().title<<"\n";upNext.pop();}else std::cout<<"Queue is empty.\n";break;case 4:std::cout<<"Song id (s1-s3): ";std::cin>>id;if(library.count(id))upNext.push(library.at(id));else std::cout<<"Unknown id.\n";break;case 5:if(!history.empty()){std::cout<<"Previous: "<<history.top().title<<"\n";history.pop();}else std::cout<<"No listening history.\n";break;case 6:{std::set<std::string> shared,all;std::set_intersection(mine.begin(),mine.end(),friendSongs.begin(),friendSongs.end(),std::inserter(shared,shared.begin()));std::set_union(mine.begin(),mine.end(),friendSongs.begin(),friendSongs.end(),std::inserter(all,all.begin()));std::cout<<"Taste match: "<<(all.empty()?0:100*shared.size()/all.size())<<"%\nShared songs: ";for(const auto& song:shared)std::cout<<song<<' ';std::cout<<"\n";break;}case 7:for(const auto& row:cardGrid){for(const auto& cell:row)std::cout<<cell<<"  ";std::cout<<"\n";}break;case 0:running=false;break;default:std::cout<<"Choose a listed option.\n";}}
    return 0;
}
