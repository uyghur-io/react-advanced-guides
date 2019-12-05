import React, { useState, useEffect } from "react";
import ChatAPI from "./ChatAPI";

class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return "Loading...";
    }
    return this.state.isOnline ? "Online" : "Offline";
  }

  static defaultProps = {
    friend: { id: 42 }
  };
}

function FriendStatusHooks(props) {
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    const handleStatusChange = status => setIsOnline(status.isOnline);
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    // Specify how to clean up after this effect:
    return () =>
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  }, [props.friend.id]);

  if (isOnline === null) {
    return "Loading...";
  }
  return isOnline ? "Online" : "Offline";
}

export default function(props) {
  return (
    <>
      <div>
        <FriendStatus friend={{ id: 42 }} />
      </div>
      <div>
        <FriendStatus friend={{ id: 43 }} />
      </div>
      <div>
        <FriendStatusHooks friend={{ id: 123 }} />
      </div>
      <div>
        <FriendStatusHooks friend={{ id: 124 }} />
      </div>
    </>
  );
}
