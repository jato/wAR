class Game < ActiveRecord::Base

  attr_accessible :winner_id, :name


  has_many :players
  has_many :rounds
  belongs_to :winner, :class_name => "Player"

  def new_player(user)
    Player.create({:user => user, :game => self})
  end

  def win

  end

  def end

  end

end
