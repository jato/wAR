class Playercard < ActiveRecord::Base

  SUIT_WEIGHT = Card::SUIT_WEIGHT
  VALUE_WEIGHT = Card::VALUE_WEIGHT

  attr_accessible :card_id

  belongs_to :user
  belongs_to :card
  has_one :played_card, :dependent => :destroy

  validates_presence_of :user_id
  validates_presence_of :card_id



  # def hand_order
  #   suit_weight*13 + value_weight   
  # end
  # half deck cycle until nil
  
end
