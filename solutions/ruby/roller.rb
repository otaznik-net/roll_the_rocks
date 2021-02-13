# This string roller was created as a merger of simpler approach
#
# ```
#  _ _ _
# | |_| |
# | |_|_|
# |_|_ _|
# ```
# 9 character long string
#
# ```
#  _ _ _ _
# |_ _ _| |
# | |_| | |
# | |_|_| |
# |_|_ _|_|
# |_ _ _ _|
# ```
# 20 character long string
#
# it was noticed that there is clear pattern in block size:
# 1, 1, 2, 2, 3, (3, 4, 4)
#
# all even blocks grow from center to the right and down and odd blocks grows
# to the left and upward
#
# initial idea was splitting the boxes and merge them together later, BUT
# it proved easier to just fill it this way
#
class Roller
  def self.roll_it(string:)
    array_size = Math.sqrt(string.size).ceil
    picture = Array.new(array_size) { Array.new(array_size) { ' ' } }

    x = ((array_size-1)/2.0).floor # center_x
    y = ((array_size-1)/2.0).ceil # center_y

    for i in 0..array_size-1 do
      dx = (i - x).abs
      block = 2 * dx + ( i <= x ? 1 : 0 )
      offset = block * (block - 1)
      block.times { |n|
        if i <= x
          picture[y+(dx)-n][i] = string[offset + n] # left
          picture[y-(dx)-1][i+n] = string[offset + n + block] # up
        else
          picture[y-dx+n][i] = string[offset + n] # right
          picture[y+dx][i-n] = string[offset + n + block] # down
        end
      }
    end

    picture
  end
end

#string = File.open('string.txt', 'r') { |f| f.gets.chomp }
#string = '523___641'
#string = '523   6410'
puts Roller.roll_it(
  string: File.open('string.txt', 'r') { |f| f.gets.chomp }
).map(&:join).join("\n")
