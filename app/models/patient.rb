class Patient < ActiveRecord::Base
	validates :firstname, presence: true
	validates :lastname, presence: true
end
